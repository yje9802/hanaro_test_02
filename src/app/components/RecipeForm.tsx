"use client"; // 클라이언트 컴포넌트로 선언

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // useRouter 임포트
import { useSession } from "next-auth/react"; // 세션 훅 가져오기
import { FaTimes } from "react-icons/fa"; // X 아이콘 추가

interface Recipe {
    id: number;
    title: string;
    tag: string[];
    ingredients: string[];
    description: string[]; // description을 배열로 수정
}

const RecipeForm: React.FC = () => {
    const { data: session } = useSession(); // 세션 정보 가져오기
    const userId = session?.user?.email || "guest"; // 유저 이메일 또는 게스트 설정
    const router = useRouter(); // useRouter 훅 사용
    const [recipe, setRecipe] = useState<Recipe>({
        id: Date.now(), // 임시 ID
        title: "",
        tag: [],
        ingredients: [],
        description: [],
    });

    const [tagInput, setTagInput] = useState("");
    const [ingredientInput, setIngredientInput] = useState("");
    const [descriptionInput, setDescriptionInput] = useState(""); // 조리 과정 입력 상태

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setRecipe({ ...recipe, [name]: value });
    };

    const handleTagAdd = () => {
        if (tagInput.trim()) {
            const newTag = `#${tagInput.trim()}`;
            setRecipe((prev) => ({
                ...prev,
                tag: [...prev.tag, newTag],
            }));
            setTagInput(""); // 입력 필드 초기화
        }
    };

    const handleIngredientAdd = () => {
        if (ingredientInput.trim()) {
            setRecipe((prev) => ({
                ...prev,
                ingredients: [...prev.ingredients, ingredientInput.trim()],
            }));
            setIngredientInput(""); // 입력 필드 초기화
        }
    };

    const handleIngredientRemove = (index: number) => {
        // 재료 삭제 핸들러
        setRecipe((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((_, i) => i !== index),
        }));
    };

    const handleDescriptionAdd = () => {
        // 조리 과정 추가 핸들러
        if (descriptionInput.trim()) {
            setRecipe((prev) => ({
                ...prev,
                description: [...prev.description, descriptionInput.trim()],
            }));
            setDescriptionInput(""); // 입력 필드 초기화
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // 로컬 스토리지에 레시피 저장
        // const storedRecipes = JSON.parse(
        //     localStorage.getItem("recipes") || "[]",
        // );
        // localStorage.setItem(
        //     "recipes",
        //     JSON.stringify([...storedRecipes, recipe]),
        // );
        // 유저별로 로컬 스토리지에 저장
        const storedRecipes = JSON.parse(
            localStorage.getItem(`recipes_${userId}`) || "[]",
        );
        localStorage.setItem(
            `recipes_${userId}`,
            JSON.stringify([...storedRecipes, recipe]),
        );

        console.log("제출된 레시피:", recipe);
        // 폼 리셋
        setRecipe({
            id: Date.now(),
            title: "",
            tag: [],
            ingredients: [],
            description: [],
        });

        // /recipes 페이지로 이동
        router.push("/recipes"); // 페이지 이동 추가
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-10 bg-white">
            <h1 className="text-2xl font-semibold">새 레시피 추가하기</h1>

            <div>
                <label
                    htmlFor="title"
                    className="block text-base font-medium text-gray-700"
                >
                    레시피 제목
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="레시피 제목을 입력하세요."
                    value={recipe.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-1/2 border border-gray-300 rounded-md p-2"
                />
            </div>

            <div>
                <label
                    htmlFor="tags"
                    className="block text-base font-medium text-gray-700"
                >
                    태그
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="mt-1 mr-2 block w-1/2 border border-gray-300 rounded-md p-2"
                    />
                    <button
                        type="button"
                        onClick={handleTagAdd}
                        className="ml-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
                    >
                        추가
                    </button>
                </div>
                <div className="mt-2">
                    <span className="text-sm text-gray-500">
                        현재 태그: {recipe.tag.join(", ")}
                    </span>
                </div>
            </div>

            <div>
                <label
                    htmlFor="ingredients"
                    className="block text-base font-medium text-gray-700"
                >
                    재료 목록
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={ingredientInput}
                        onChange={(e) => setIngredientInput(e.target.value)}
                        className="mt-1 mr-2 block w-1/2 border border-gray-300 rounded-md p-2"
                    />
                    <button
                        type="button"
                        onClick={handleIngredientAdd}
                        className="ml-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
                    >
                        추가
                    </button>
                </div>
                <div className="mt-2 flex flex-wrap">
                    {recipe.ingredients.map((ingredient, index) => (
                        <div
                            key={index}
                            className="flex items-center bg-gray-100 p-2 rounded-md mr-2 mb-2"
                        >
                            <span className="text-gray-700">{ingredient}</span>
                            <button
                                type="button"
                                onClick={() => handleIngredientRemove(index)}
                                className="ml-2 text-red-600 hover:text-red-800"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="block text-base font-medium text-gray-700"
                >
                    조리 과정
                </label>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                        className="mt-1 mr-2 block w-1/2 border border-gray-300 rounded-md p-2"
                    />
                    <button
                        type="button"
                        onClick={handleDescriptionAdd} // 추가 버튼 클릭 시 조리 과정 추가
                        className="ml-2 bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
                    >
                        추가
                    </button>
                </div>
                <div className="mt-2">
                    <ol className="list-decimal pl-5 text-sm text-gray-500">
                        {recipe.description.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>
            </div>

            <button
                type="submit"
                className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition"
            >
                레시피 추가하기
            </button>
        </form>
    );
};

export default RecipeForm;

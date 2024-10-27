"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // 세션 훅 가져오기
import { useRouter } from "next/navigation"; // useRouter 사용

interface Recipe {
    id: number;
    title: string;
    tag: string[];
    ingredients: string[];
    description: string[];
}

interface RecipeEditFormProps {
    recipeId: string;
}

const RecipeEditForm: React.FC<RecipeEditFormProps> = ({ recipeId }) => {
    const { data: session } = useSession(); // 세션 정보 가져오기
    const userId = session?.user?.email || "guest"; // 유저 이메일 또는 게스트 설정
    const router = useRouter(); // useRouter 훅 사용

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [title, setTitle] = useState("");
    const [tag, setTag] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<string[]>([]);
    const [description, setDescription] = useState<string[]>([]);

    useEffect(() => {
        const storedRecipes = localStorage.getItem(`recipes_${userId}`);
        if (storedRecipes) {
            const recipes: Recipe[] = JSON.parse(storedRecipes);
            const foundRecipe = recipes.find((r) => r.id === Number(recipeId));
            if (foundRecipe) {
                setRecipe(foundRecipe);
                setTitle(foundRecipe.title);
                setTag(foundRecipe.tag);
                setIngredients(foundRecipe.ingredients);
                setDescription(foundRecipe.description);
            }
        }
    }, [recipeId]);

    const handleSave = () => {
        const storedRecipes = localStorage.getItem(`recipes_${userId}`);
        if (storedRecipes) {
            const recipes: Recipe[] = JSON.parse(storedRecipes);
            const updatedRecipes = recipes.map((r) =>
                r.id === Number(recipeId)
                    ? { ...r, title, tag, ingredients, description }
                    : r,
            );
            localStorage.setItem(
                `recipes_${userId}`,
                JSON.stringify(updatedRecipes),
            );
            // 수정 후 레시피 상세 페이지로 이동
            router.push(`/detail/${recipeId}`); // 레시피 상세 페이지로 이동
        }
    };

    if (!recipe) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-10 w-[700px] mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-4">레시피 수정</h1>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        레시피 제목
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        태그
                    </label>
                    <input
                        type="text"
                        value={tag.join(", ")}
                        onChange={(e) =>
                            setTag(
                                e.target.value.split(",").map((t) => t.trim()),
                            )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        재료
                    </label>
                    <input
                        type="text"
                        value={ingredients.join(", ")}
                        onChange={(e) =>
                            setIngredients(
                                e.target.value.split(",").map((i) => i.trim()),
                            )
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                        조리 과정
                    </label>
                    <textarea
                        value={description.join("\n")}
                        onChange={(e) =>
                            setDescription(e.target.value.split("\n"))
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 h-32"
                    />
                </div>
                <button
                    onClick={handleSave}
                    className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition transition-transform hover:scale-105"
                >
                    저장
                </button>
            </div>
        </div>
    );
};

export default RecipeEditForm;

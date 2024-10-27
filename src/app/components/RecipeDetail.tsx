"use client"; // 클라이언트 컴포넌트로 선언

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react"; // 세션 훅 가져오기
import { useRouter } from "next/navigation"; // useRouter 사용
import Link from "next/link";

interface Recipe {
    id: number;
    title: string;
    tag: string[];
    ingredients: string[];
    description: string[];
}

interface RecipeDetailProps {
    params: {
        id: string;
    };
}

const RecipeDetail: React.FC<RecipeDetailProps> = ({ params }) => {
    const { data: session } = useSession(); // 세션 정보 가져오기
    const userId = session?.user?.email || "guest"; // 유저 이메일 또는 게스트 설정
    const router = useRouter(); // useRouter 훅 사용

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const id = params.id; // URL에서 id 가져오기
    // 타이머 관련 state
    const [timerStarted, setTimerStarted] = useState(false);
    const [timerInput, setTimerInput] = useState<number>(10); // 기본 시간 10초
    const [inputError, setInputError] = useState<string>("");
    const [remainingTime, setRemainingTime] = useState<number>(timerInput); // 남은 시간
    const intervalRef = useRef<NodeJS.Timeout | null>(null); // setInterval 참조

    // id를 통해 로컬 스토리지에서 레시피 정보 가져오기
    useEffect(() => {
        const storedRecipes = localStorage.getItem(`recipes_${userId}`);
        if (storedRecipes) {
            const recipes: Recipe[] = JSON.parse(storedRecipes);
            const foundRecipe = recipes.find((r) => r.id === Number(id));
            setRecipe(foundRecipe || null);
        }
    }, [id]);

    // 타이머 시작 핸들러
    const startTimer = () => {
        if (!timerStarted && !inputError) {
            setTimerStarted(true); // 타이머 시작
            setRemainingTime(timerInput); // 남은 시간을 입력된 시간으로 초기화

            intervalRef.current = setInterval(() => {
                setRemainingTime((prevTime) => {
                    if (prevTime > 1) {
                        return prevTime - 1;
                    } else {
                        clearInterval(intervalRef.current!);
                        alert("타이머 종료! 조리 과정을 시작하세요! ⏰");
                        setTimerStarted(false); // 타이머 종료 후 초기화
                        return 0;
                    }
                });
            }, 1000);
        }
    };

    // 타이머 시간 입력 핸들러
    const handleTimerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        if (isNaN(value) || value <= 0) {
            setInputError("유효한 시간을 입력해주세요.");
        } else {
            setTimerInput(value);
            setRemainingTime(value); // 입력한 시간에 맞게 남은 시간 업데이트
            setInputError("");
        }
    };

    // 레시피 정보가 없는 경우
    if (!recipe) {
        return (
            <div className="flex justify-center items-center h-64">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                    레시피를 찾을 수 없습니다. 😢
                </h2>
            </div>
        );
    }

    // 레시피 삭제 핸들러
    const handleDelete = () => {
        // 삭제 확인을 위한 경고창
        const confirmDelete = window.confirm(
            "정말로 이 레시피를 삭제하시겠습니까? 삭제하면 되돌릴 수 없어요 🥲",
        );

        if (confirmDelete) {
            const storedRecipes = localStorage.getItem(`recipes_${userId}`);
            if (storedRecipes) {
                const recipes: Recipe[] = JSON.parse(storedRecipes);
                const updatedRecipes = recipes.filter(
                    (r) => r.id !== recipe.id,
                );
                localStorage.setItem(
                    `recipes_${userId}`,
                    JSON.stringify(updatedRecipes),
                );
                // 삭제 후 목록으로 돌아가기
                router.push(`/recipes`); // 레시피 상세 페이지로 이동
            }
        }
    };

    return (
        <div className="p-10 w-[700px] mx-auto">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{recipe.title}</h1>
                    {/* 가로선 추가 */}
                    <hr className="border-t-2 border-gray-300 mb-4" />
                    <div className="flex flex-wrap gap-2 mb-8">
                        {recipe.tag.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* 타이머 설정 */}
                    <div className="mb-8">
                        <label className="block text-lg font-medium mb-2">
                            타이머 시간 설정 (초)
                        </label>
                        <div className="flex items-center gap-4">
                            {" "}
                            {/* 수정된 부분 */}
                            <input
                                type="number"
                                value={remainingTime} // 남은 시간 표시
                                onChange={handleTimerChange}
                                className="border rounded px-2 py-1 w-32 text-center"
                                min="1"
                                disabled={timerStarted} // 타이머 시작 시 수정 불가
                            />
                            <button
                                onClick={startTimer}
                                disabled={timerStarted || !!inputError} // 에러가 있을 때 비활성화
                                className={`${
                                    timerStarted
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 hover:bg-green-600"
                                } text-white px-4 py-2 rounded-md transition`}
                            >
                                ⏰ 타이머 시작
                            </button>
                        </div>
                        {inputError && (
                            <p className="text-red-500 text-sm mt-2">
                                {inputError}
                            </p>
                        )}
                    </div>

                    <h2 className="text-xl font-semibold mb-2">🔖 재료</h2>
                    <ul className="list-disc list-inside mb-7">
                        {recipe.ingredients.map((ingredient, index) => (
                            <span
                                key={index}
                                className="bg-yellow-100 text-gray-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                            >
                                {ingredient}
                            </span>
                        ))}
                    </ul>
                    <h2 className="text-xl font-semibold mb-2">📌 조리 과정</h2>
                    <ol className="list-decimal list-inside bg-gray-100 p-3 rounded">
                        {recipe.description.map((step, index) => (
                            <li key={index} className="mb-2">
                                {step}
                            </li>
                        ))}
                    </ol>

                    {/* 버튼 추가 */}
                    <div className="flex justify-between mt-10">
                        <Link href={`/edit/${recipe.id}`}>
                            <button className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition">
                                ✏️ 레시피 수정
                            </button>
                        </Link>
                        <button
                            onClick={handleDelete}
                            className="bg-red-400 text-white px-4 py-2 rounded-md hover:bg-red-500 transition"
                        >
                            🗑️ 삭제
                        </button>
                        <Link href="/recipes">
                            <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition">
                                ↩️ 목록으로 돌아가기
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetail;

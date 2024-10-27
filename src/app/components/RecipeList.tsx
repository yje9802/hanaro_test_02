"use client"; // 클라이언트 컴포넌트로 선언

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react"; // 세션 훅 가져오기
import Link from "next/link";

interface Recipe {
    id: number;
    title: string;
    tag: string[];
    ingredients: string[];
    description: string[];
}

const RecipeList = () => {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const { data: session } = useSession(); // 세션 정보 가져오기
    const userId = session?.user?.email || "guest"; // 유저 이메일 또는 게스트 설정

    // 컴포넌트가 마운트될 때 localStorage에서 레시피 불러오기
    useEffect(() => {
        const storedRecipes = localStorage.getItem(`recipes_${userId}`);
        if (storedRecipes) {
            setRecipes(JSON.parse(storedRecipes)); // 저장된 레시피를 배열로 파싱
        }
    }, []);

    return (
        <div className="mt-10 px-16 py-5">
            {/* 레시피 목록 */}
            {recipes.length > 0 ? (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recipes.map((recipe) => (
                        <li
                            key={recipe.id}
                            className="mb-5 border border-gray-300 rounded-lg shadow-lg overflow-hidden"
                        >
                            {/* 최소 높이 설정 */}
                            <div className="p-5 bg-white min-h-[150px]">
                                <h3 className="text-xl font-bold mb-2">
                                    {recipe.title}
                                </h3>

                                {/* 태그 표시 */}
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {recipe.tag.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* 버튼 표시 */}
                                <Link href={`/detail/${recipe.id}`}>
                                    <button className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-600 transition transition-transform hover:scale-105">
                                        🔎 레시피 자세히 보기
                                    </button>
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // 저장된 레시피가 없는 경우
                <div className="flex justify-center items-center h-64">
                    <h2 className="text-2xl font-semibold mb-4 text-center">
                        이런... 아직 저장된 레시피가 없네요! 🧑‍🍳
                    </h2>
                </div>
            )}
        </div>
    );
};

export default RecipeList;

"use client"; // 클라이언트 컴포넌트로 선언

import Login from "./components/Login";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
    const { data: session } = useSession(); // 세션 정보를 가져옴
    useEffect(() => {
        if (session) {
            localStorage.setItem("user", JSON.stringify(session.user));
        }
    }, [session]);

    // 세션이 있으면 다른 페이지로 리다이렉트
    if (session) {
        redirect("/recipes");
    }

    return (
        <div className="flex items-center justify-center h-[80vh] p-8 pb-20 sm:p-20 font-[family-name:var(--font-noto-sans-kr)]">
            <Login />
        </div>
    );
}

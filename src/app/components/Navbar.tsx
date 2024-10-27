"use client"; // 클라이언트 컴포넌트로 선언

import { usePathname } from "next/navigation"; // usePathname 사용
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import LoginButton from "./LoginButton";
import Logo from "@/public/logo.png";

const Navbar = () => {
    const pathname = usePathname(); // 현재 경로를 가져옴
    const { data: session } = useSession(); // 세션 정보를 가져옴

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-gray-100 shadow-md">
            <Link href="/recipes" className="flex items-center space-x-2">
                <Image src={Logo} alt="로고 이미지" width={50} height={50} />
                <h1 className="text-3xl font-bold">나만의 레시피</h1>
            </Link>

            <ul className="flex gap-4 items-center">
                <li>
                    {/* /add 페이지면 "레시피 목록 보기" /recipes 페이지면 "레시피 추가하기"로 버튼 내용이 변경 */}
                    <Link href={pathname === "/add" ? "/recipes" : "/add"}>
                        <button className="bg-slate-400 text-white px-4 py-2 rounded-md hover:bg-cyan-600 transition">
                            {pathname === "/add"
                                ? "레시피 목록 보기"
                                : "레시피 추가하기"}
                        </button>
                    </Link>
                </li>

                {session ? (
                    // 세션 정보가 있을 경우, Sign out 버튼 표시
                    <>
                        <LoginButton
                            text="로그아웃"
                            onClick={
                                () =>
                                    signOut({
                                        callbackUrl: "http://localhost:3000",
                                    }) // 로그아웃 후 리다이렉트
                            }
                        />
                    </>
                ) : (
                    // 세션 정보가 없을 경우, 로그인 옵션 표시
                    <>
                        <LoginButton
                            text="Sign in with Email"
                            onClick={() => signIn("credentials")} // 이메일 로그인
                        />
                        <LoginButton
                            text="Sign in with Google"
                            onClick={() => signIn("google")} // Google 로그인
                        />
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;

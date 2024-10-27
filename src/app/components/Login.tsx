import React from "react";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { MdOutlineArrowOutward } from "react-icons/md";
import Image from "next/image";
import Salad from "@/public/salad.jpg";
import Logo from "@/public/logo.png";

const Login = () => {
    return (
        <section className="h-screen flex flex-col md:flex-row justify-center space-y-10 md:space-y-0 md:space-x-16 items-center my-2 mx-5 md:mx-0 md:my-0 ">
            <div className="border border-gray-300 rounded-md p-8 flex flex-col items-center bg-slate-200 shadow-[0_4px_9px_-4px_#404a5a]">
                <div className="flex items-center space-x-2 mb-4">
                    <Image
                        src={Logo}
                        alt="로고 이미지"
                        width={50}
                        height={50}
                    />
                    <h1 className="text-3xl font-bold text-center">
                        하나로 레시피
                    </h1>
                </div>
                {/* flex 설정으로 이미지와 로그인 폼을 나란히 배치 */}
                <div className="flex flex-col md:flex-row items-center md:space-x-16">
                    <div className="md:w-1/2 max-w-sm">
                        <Image
                            src={Salad}
                            alt="Sample Image"
                            width={500}
                            height={300}
                        />
                    </div>
                    <div className="md:w-1/2 max-w-sm">
                        <div className="flex items-center justify-center md:justify-start">
                            <label className="mr-1">Sign in with</label>
                            <button
                                type="button"
                                className="mx-1 h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-300 text-white shadow-[0_4px_9px_-4px_#3b71ca]"
                                onClick={() => signIn("google")}
                            >
                                <FcGoogle
                                    size={20}
                                    className="flex justify-center items-center w-full"
                                />
                            </button>
                            <button
                                type="button"
                                className="inline-block mx-1 h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-300 uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]"
                                onClick={() => signIn("github")}
                            >
                                <FaGithub
                                    size={20}
                                    className="flex justify-center items-center w-full"
                                />
                            </button>
                        </div>

                        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                            <p className="mx-4 mb-0 text-center font-semibold text-slate-500">
                                Or
                            </p>
                        </div>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                const target = e.target as HTMLFormElement;
                                const email = (
                                    target.elements.namedItem(
                                        "email",
                                    ) as HTMLInputElement
                                ).value;
                                const password = (
                                    target.elements.namedItem(
                                        "password",
                                    ) as HTMLInputElement
                                ).value;
                                signIn("credentials", { email, password });
                            }}
                        >
                            <input
                                name="email"
                                className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
                                type="email"
                                placeholder="Email Address"
                                required
                            />
                            <input
                                name="password"
                                className="text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded mt-4"
                                type="password"
                                placeholder="Password"
                                required
                            />

                            <div className="text-center md:text-left">
                                <button
                                    className="mt-4 bg-slate-800 hover:bg-blue-700 px-4 py-2 text-white uppercase rounded text-xs tracking-wider"
                                    type="submit"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                        <div className="mt-4 font-semibold text-sm text-slate-500 text-center md:text-left">
                            아직 계정이 없으신가요?{" "}
                            <a
                                className="text-red-600 hover:underline hover:underline-offset-4 inline-flex items-center"
                                href="#"
                            >
                                Register
                                <MdOutlineArrowOutward className="ml-1" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;

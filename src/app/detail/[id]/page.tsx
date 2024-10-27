import React from "react";
import Navbar from "@/app/components/Navbar";
import RecipeDetail from "@/app/components/RecipeDetail";

const RecipeDetailPage = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <Navbar />
            <RecipeDetail params={params} />
        </>
    );
};

export default RecipeDetailPage;

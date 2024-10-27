import React from "react";
import Navbar from "@/app/components/Navbar";
import RecipeEditForm from "@/app/components/RecipeEditForm";

const RecipeDetailEditPage = ({ params }: { params: { id: string } }) => {
    return (
        <>
            <Navbar />
            <RecipeEditForm recipeId={params.id} />
        </>
    );
};

export default RecipeDetailEditPage;

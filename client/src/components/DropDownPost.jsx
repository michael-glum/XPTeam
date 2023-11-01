import React from "react";
import FlexBetween from "./FlexBetween";
import { Box, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setPosts } from "../state";

const DropDownPost = ({ postId = undefined }) => {
    const dispatch = useDispatch();
    const { palette } = useTheme();
    const neutralLight = palette.neutral.light;

    const token = useSelector((state) => state.token);

    const deletePost = async () => {
        const response = await fetch(
            `http://localhost:3001/posts/${postId}/delete`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const posts = await response.json();
        dispatch(setPosts({ posts }))
    };

    return (
        <FlexBetween 
            position="absolute"
            zIndex=".5"
            marginLeft="21.75rem"
            borderRadius= "0.75rem 0rem 0.75rem .75rem"
            border=".1rem solid"
            borderColor={neutralLight}
            sx={{
                backgroundColor: palette.background.alt,
                padding: ".8rem 2.25rem .8rem 2.25rem",
            }}
        >
                <Typography
                    color="red"
                    variant="h7"
                    fontWeight="400"
                    onClick={() => deletePost()}
                    sx={{
                        "&:hover": {
                            color: "red",
                            cursor: "pointer"
                        }
                    }}
                >
                    Delete Post
                </Typography>
        </FlexBetween>
    )
}

export default DropDownPost
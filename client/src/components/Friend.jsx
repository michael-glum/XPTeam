import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { setFriends } from "../state";
import DropDownPost from "./DropDownPost";
import { useState } from "react";

const Friend = ({ friendId, name, subtitle, userPicturePath, isProfile = false, postId = undefined }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const friends = useSelector((state) => state.user.friends);

    const { palette } = useTheme();
    const primaryLight = palette.primary.light;
    const primaryDark = palette.primary.dark;
    const main = palette.neutral.main;
    const medium = palette.neutral.medium;

    const [openPostMenu, setOpenPostMenu] = useState(false);

    const isFriend = !isProfile ? friends.find((friend) => friend._id === friendId)
        : friends.find((friend) => friend._id === _id);

    const patchFriend = async () => {
        const response = await fetch(
            `http://localhost:3001/users/${_id}/${friendId}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ isProfile: isProfile })
            }
        );
        const data = await response.json();
        dispatch(setFriends({ friends: data }));
    };

    return (
        <>
        <FlexBetween>
            <FlexBetween gap="1rem">
                <UserImage image={userPicturePath} size="55px" />
                <Box
                    onClick={() => {
                        navigate(`/profile/${friendId}`);
                        navigate(0);
                    }}
                >
                    <Typography
                        color={main}
                        variant="h5"
                        fontWeight="500"
                        sx={{
                            "&:hover": {
                                color: palette.primary.light,
                                cursor: "pointer"
                            }
                        }}
                    >
                        {name}
                    </Typography>
                    <Typography color={medium} fontSize="0.75rem">
                        {subtitle}
                    </Typography>
                </Box>
            </FlexBetween>
            {friendId !== _id ? (
                <IconButton
                    onClick={() => patchFriend()}
                    sx={{ backgroundColor: primaryLight, p: "0.6rem"}}
                >
                    {isFriend ? (
                        <PersonRemoveOutlined sx={{ color: primaryDark }} />
                    ) : (
                        <PersonAddOutlined sx={{ color: primaryDark }} />
                    )}
                </IconButton>) : (
                <IconButton
                    onClick={() => setOpenPostMenu((prev) => !prev)}
                    sx={{ backgroundColor: primaryLight, p: "0.6rem"}}
                >
                    <MoreVertIcon sx={{ color: primaryDark }} />
                </IconButton>)
            }
        </FlexBetween>
        {
            openPostMenu && !isFriend && <DropDownPost postId={postId}/>
        }
        </>
    );
};

export default Friend;
import React, { useEffect, useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import GraphResolvers from "../../../../lib/apollo/apiGraphStrings";
import { useMutation, useQuery } from "@apollo/client";
import { handleFavorite } from "lib/apollo/apolloFunctions/mutations";

interface Favorite {
  favId: string;
  favType: string;
}

const favorite = ({ favId, favType }: Favorite) => {
  const [btn, toggleBtn] = useState(false);

  const { data } = useQuery(GraphResolvers.queries.IS_FAVORITE, {
    variables: { favType, favId },
  });

  const [updateFavorite] = useMutation(
    GraphResolvers.mutations.HANDLE_FAVORITE
  );

  useEffect(() => {
    data && toggleBtn(data.isFavorite);
  }, [data]);

  const favoriteHandler = () => {
    if (data && data.isFavorite) {
      handleFavorite(updateFavorite, false, favType, favId);
      toggleBtn(false);
      return;
    }

    if (data && !data.isFavorite) {
      handleFavorite(updateFavorite, true, favType, favId);
      toggleBtn(true);
    }
  };

  return (
    <>
      <IconButton
        aria-label="heart"
        onClick={() => favoriteHandler()}
        icon={
          btn ? (
            <AiTwotoneHeart size="22px" color="red" />
          ) : (
            <AiOutlineHeart size="22px" />
          )
        }
        bg="none"
        _hover={{ bg: "none" }}
        _focus={{ outline: "none" }}
        size="sm"
      />
    </>
  );
};

export default favorite;

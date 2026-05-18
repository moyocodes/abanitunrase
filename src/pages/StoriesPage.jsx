import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { LOOKS } from "@/data";

export default function StoriesPage() {
  const { category } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const catIdx =
      category === "bridal" ? 0 : category === "occasion" ? 1 : 2;
    const firstIdx = LOOKS.findIndex((l) => l.catIdx === catIdx);
    navigate("/", {
      replace: true,
      state: { openStoryIdx: firstIdx >= 0 ? firstIdx : 0 },
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

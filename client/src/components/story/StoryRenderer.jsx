import SlokaComponent from "./SlokaComponent";

export default function StoryRenderer({ story }) {
    const { content, translation, isHighlighted, viewedBy, date } = story;
    return (
        <SlokaComponent content={content} translation={translation} isHighlighted={isHighlighted} viewedBy={viewedBy.length} date={date} />
)};

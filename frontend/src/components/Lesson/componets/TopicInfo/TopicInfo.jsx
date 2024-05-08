export default function TopicInfo(props) {
    console.log(props.dataLesson.name);
    return (<div>
        <h1>{props.dataLesson.name}</h1>
        <div>
        <div dangerouslySetInnerHTML={{ __html: props.dataLesson.description }} />
        </div>
    </div>)
}
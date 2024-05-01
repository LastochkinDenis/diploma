import { Editor } from "@tinymce/tinymce-react";
import { useEffect } from "react";

export default function OpenQuestion(props) {
    
    const handleEditorChange = (content) => {
        props.setIsUpdate(true);
        props.setDataToUpdate({description: content, ...props.dataToUpdate});
    };

    const handleChangeAnswer = (evt) => {
        props.setIsUpdate(true);
        props.setDataToUpdate({rigthText: evt.target.value, ...props.dataToUpdate});
    }

    useEffect(() => {
        document.querySelector('.rith-answer input').value = props.rigthText;        
    }, []);

    const handleEditorInit = () => {

    };


    return (
        <div>
            <h2>Текст задания</h2>
            <Editor
            apiKey='mqeiptnd73o3sf7988afucxpb2ekta4j4u0fnqoiz13fpegb'
            onEditorChange={handleEditorChange}
            initialValue={props.description}
            init={{
                height: 200,
                toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | removeformat',
                setup: handleEditorInit,
                menubar: false,
                images_file_types: 'jpg, svg, webp, png'
            }}
            />
            <h2>Правильный ответ</h2>
            <label className="rith-answer">
                <input onChange={handleChangeAnswer}/>
            </label>
        </div>
    )
}
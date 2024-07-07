import './ProgramTaskStyle.css';

import { Editor } from "@tinymce/tinymce-react";
import { useEffect ,useState } from 'react';


export default function ProgramTask(props) {

    const [fileName, setFileName] = useState('');

    useEffect(() => {
        setFileName(props.fileName)
    }, [])

    const handleEditorChange = (content) => {
        props.setIsUpdate(true);
        props.setDataToUpdate((prevData) => ({
            ...prevData,
            description: content,
          }));
    };

    const handleEditorInit = () => {

    };

    const handleChangeFile = (evt) => {
        const file = evt.target.files[0];
        
        let fileReader = new FileReader();
        
        fileReader.onload = () => {
            setFileName(file.name);
            props.setIsUpdate(true);
            props.setDataToUpdate({file: {file: fileReader.result, fileName: file.name}, ...props.dataToUpdate});
        }

        if(file){
            fileReader.readAsDataURL(file);
        }
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
            <h2>Файл для дестирования</h2>
            <div className="program-form">
                <p>{fileName}</p>
                <form>
                    <label className="add-file">
                        <p>Добавить файл для тестирование</p>
                        <input type='file' onChange={handleChangeFile} accept='.json' />
                    </label>
                   <div className="help-modal__wraper">
                    <div className="help-modal-icon">
                        <span>?</span>
                    </div>
                    <div className="help-modal">
                        <p>Для проведения тестирования програмной задчи нужно загрузить файл в формате json. Json дожен иметь следующую структуру {`[
	{"inputData": [список вводимых данных], "result": резульат},
]`}</p>
                    </div>
                   </div>
                </form>
            </div>
        </div>
    )
}
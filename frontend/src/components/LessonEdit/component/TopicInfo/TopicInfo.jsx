
import { Editor } from '@tinymce/tinymce-react';
import { useOutletContext } from "react-router-dom";

export default function TopicInfo(props) {
    
    let setIsUpdate = useOutletContext()[3];
    let setLinkRequestForServer = useOutletContext()[4];
    let dataToUpdate = useOutletContext()[5];
    let setDataToUpdate = useOutletContext()[6];

    const handleEditorChange = (content) => {
        setIsUpdate(true);
        setDataToUpdate((prevData) => ({
          ...prevData,
          text: content,
        }));
    };

    const handleEditorInit = () => {

    }

  return (
    <Editor
      apiKey='mqeiptnd73o3sf7988afucxpb2ekta4j4u0fnqoiz13fpegb'
      onEditorChange={handleEditorChange}
      initialValue={props.text}
      init={{
        toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | removeformat',
        setup: handleEditorInit,
        menubar: false,
        images_file_types: 'jpg, svg, webp, png'
      }}
    />
  );
}
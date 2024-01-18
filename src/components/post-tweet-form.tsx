import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { useState } from 'react';
import styled from 'styled-components';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  &::placeholder {
    font-size: 16px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  &:focus{
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 28px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  color: white;
  border:none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active{
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false)
  const [tweet, setTweet] = useState("")
  const [file, setFile] = useState<File|null>(null)
  const onChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value)
  }
  const onFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const {files} = e.target
    if(files && files.length === 1){
      setFile(files[0])
    }
  }

  const onSubmit = async(e:React.FormEvent<HTMLFormElement>)  => {
    e.preventDefault()
    const user = auth.currentUser
    if(!user || isLoading || tweet === "" || tweet.length > 180) return;
    try{
      setLoading(true)
      const doc = await addDoc(collection(db, "tweets"), {              // db의 tweets라는 문서를 추가함                      // 사용자가 작성한 글이 db로 post되는 코드
        tweet,
        createAt: Date.now(),
        username: user.displayName || "Anonymous",      // 글의 내용, 시간, id, 유저의 name을 저장함
        userId: user.uid,
      })
      if(file){
        const locationRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${doc.id}`)      // localstorage에 사용자의 id와 이름으로 되어있는 폴더를 만들고 그 안에 doc id로 되어있는 파일을 만들어 img를 저장
        const result = await uploadBytes(locationRef, file)   // 파일을 업로드함
        const url = await getDownloadURL(result.ref)    // 업로드한 이미지의 url을 받아옴
        await updateDoc(doc, {    // 문서의 이미지 url을 저장
          photo: url,
        })
      }
      setTweet("")
      setFile(null)
    } catch(e) {
      console.log(e)
    } finally {
      setLoading(false)
    }

  }

  return (
    <Form onSubmit={onSubmit}>
      <TextArea required rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is happening?!" />
      <AttachFileButton htmlFor="file">{file ? "Photo added✅" : "Add Photo"}</AttachFileButton>
      <AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
      <SubmitBtn type="submit" value={isLoading ? "Posting..." : "Post Tweet"} />
    </Form>
  );
}

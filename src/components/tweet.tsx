import styled from 'styled-components';
import { ITweet } from './timeline';
import { auth, db, storage } from '../firebase';
import { deleteDoc, doc } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr, 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`

const Column = styled.div`
  
`

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px ;
`

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {   //tweet에 대한 정보를 불러옴
  const user =auth.currentUser      //user의 데이터를 불러와 user에 저장함
  const onDelete =async () => {
    const ok = confirm("Are you sure you want to delete this tweet?")
    if(!ok || user?.uid !== userId) return    //ok가 false이거나 user의 id와 게시글의 id가 다르다면 return 해줌
    try{
      await deleteDoc(doc(db, "tweets", id))  // db의 tweets이라는 테이블의 id가 같은 게시글을 삭제함
      if(photo){    // 만약 사진이 있다면 storage의 이미지도 삭제함
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`)
        await deleteObject(photoRef)
      }
    }catch(e){
      console.log(e)
    }finally{

    }
  }
  return (
    <Wrapper>
      <Column>
      <Username>{username}</Username>
      <Payload>{tweet}</Payload>      
      </Column>
      <Column>
      {photo ? (
        <Photo src={photo}/>
      ): null}
      {user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton>: null}
      </Column>
    </Wrapper>
  );
}

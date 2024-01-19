import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase';
import Tweet from './tweet';

export interface ITweet {
  id: string;
  photo: string;
  tweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const fetchTweets = async () => {
    const tweetsQuery = query(
      //db에서 query문을 돌려서 tweets라는 테이블의 내용을 가지고 와서 저장함
      collection(db, 'tweets'),
      orderBy('createAt', 'desc') // createAt은 날짜 요일 시간을 나타내주는 db 함수인데 이것을 오름차순으로 정렬함
    );
    const spanshot = await getDocs(tweetsQuery); // 이것을들 비동시를 돌려서 spanshot에 저장
    const tweets = spanshot.docs.map((doc) => {
      const { tweet, createAt, userId, username, photo } = doc.data();
      return {
        tweet,
        createAt,
        userId,
        username,
        photo,
        id: doc.id,
      };
    }); // spanshot의 doc를 각각 doc의 내용을 저장함
    setTweet(tweets);
  };
  useEffect(() => {
    fetchTweets();
  }, []);
  return <Wrapper>
  {tweets.map((tweet) => (
    <Tweet key={tweet.id} {...tweet} />
  ))}
</Wrapper>
}

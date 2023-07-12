# 사용자 데이터축적 기반의 GPT Prompt Engine

Status: Planning

## About this project

---

- GPT 모델을 이용하여 사용자와 대화를 하는 스크립트를 생성하는 엔진이다.
- 일상생활이나, 특정 용도로 사용자의 개인 비서처럼 대화를 생성한다. 마치 아이언맨의 [자비스](https://namu.wiki/w/J.A.R.V.I.S.) 처럼
- 사용자 데이터 축적 기반의 대화라 함은 단순히 질문에 대해 직관적인 답변을 내는것이 아닌 이전의 대화를 바탕으로 맥락을 판단하고 상황에 맞는 답변을 생성한다는 뜻이다.
- 많은 데이터를 주입하면서도 빠르게 답변을 생성하여 사용자에게 불편함을 최소화한다.


<img src="https://github.com/KwonSunJae/-AdvancedChatScriptGeneratorEngine/blob/main/README/KakaoTalk_Photo_2023-07-07-12-34-30_001.jpeg" height="100"/>

<img src="https://github.com/KwonSunJae/-AdvancedChatScriptGeneratorEngine/blob/main/README/KakaoTalk_Photo_2023-07-07-12-34-31_003.jpeg" height="100"/>
 
<img src="https://github.com/KwonSunJae/-AdvancedChatScriptGeneratorEngine/blob/main/README/KakaoTalk_Photo_2023-07-07-12-34-30_002.jpeg" height="100"/>



## Installation&Configuration Files Format

---

## System Components

---

![Untitled](https://github.com/KwonSunJae/-AdvancedChatScriptGeneratorEngine/blob/main/README/Untitled.png)

## Original Algorithm & Problems

---

![Untitled](https://github.com/KwonSunJae/-AdvancedChatScriptGeneratorEngine/blob/main/README/Untitled%201.png)

1. UDCS ( UserDataControlServer)에 사용자의 발화나 사용자의 행동에 대한 캡셔닝 데이터가 주어진다.
2. UDCS에서 사용자 필수 정보들을 데이터베이스에서 가져오고, 이전의 대화(Cached Dialog)와 함께 프롬프트를 생성하고 GPT에게 요청을 날린다.
3. GPT는 요청받은 응답 형식에 맞게 결과를 도출하는데, 이때 현재 사용자의 대화에서 필수적으로 저장되어야할 사용자 필수 정보를 같이 추출하고, 이번 대화를 통해 삭제 되어야할 사용자 필수 정보가 있다면 삭제데이터로 추출한다.
4. UDCS는 해당 데이터를 받아 사용자필수정보를 최신화시켜 지속적으로 앞으로 대화에 필요한 맥락들을 저장한다. 

> ***Q1. 너무 느리진 않나요?***
> 
> 
> A. 많이 느립니다. 평균 응답속도가 2분정도이며, Cached Dialog가 많이 쌓이면 쌓일수록 대화를 생성하는데 최대 4분까지 늘어나는 것을 확인 했습니다.
> 

> ***Q2. Request Prompt Format에 대해 설명해주 실 수 있나요?***
> 
> 
> A. GPT에게 답변을 요청할때, Prompt를 Request 데이터로 전송합니다. 이때, Prompt의 내용자체를 GPT가 쉽게 이해 할 수 있도록 구역을 나누어 전달한다는 의미입니다.
> 
> 예를들어,
> 
> { prompt : “ 
>                     [Cached Dialog] 
>                             ‘’’ 현재 진행되고있는 대화에서 캐시된 대화들’’’
>                     [Active Dialog]
>                            ‘’’ 현재 사용자가 발화한 대화’’’
>                     [EssentialUserData]
> 
>                            ‘’’ 사용자와 대화시 필수적으로 반영되어야할 데이터’’’
> 
>               [Response Format]
>                      ‘’’ 응답 형식 예) JSON , XML + Data Field’’’
> 
>         [GPT Role Definiton]
>                ‘’’ 응답에 대한 컨셉 및 지켜야할 규칙들을 설명’’’
> ”}
> 
> 와 같이 구역을 나누고 정확하게 이해할 수 있도록 프롬프트의 형식을 나눠주면 됩니다.
> 

## Advanced Algorithm

---

![NewArlgorithn.png](https://github.com/KwonSunJae/-AdvancedChatScriptGeneratorEngine/blob/main/README/NewArlgorithn.png)

1. UDCS ( UserDataControlServer)에 사용자의 발화나 사용자의 행동에 대한 캡셔닝 데이터가 주어진다.
2. UDCS에서는 사용자 필수 정보들을 데이터베이스에서 가져오고, ~~이전의 대화(Cached Dialog)와 함께 프롬프트를 생성하고 GPT에게 요청을 날린다.~~
3. 현재 발화된 대화의 Intense를 분석한다. 예를들어, 일상적 대화 인가? 조언을 구하는 대화인가? 알림을 필요로하는 대화인가?에 대한 답변을 통해 발화된 대화의 성격유형을 특정 조건들로 세분화한다.
4. Intense가 나오면, 제공되는 기능들에 세분화되어있는 각 프롬프트를 이용하여 GPT에게 요청을 보낸다.
5. GPT는 요청받은 응답 형식에 맞게 결과를 도출하는데, ~~이때 현재 사용자의 대화에서 필수적으로 저장되어야할 사용자 필수 정보를 같이 추출하고, 이번 대화를 통해 삭제 되어야할 사용자 필수 정보가 있다면 삭제데이터로 추출한다.~~
6. 현재 발화에 대한 스크립트만 생성한다. 그리고 대화가 종료될때, 캐쉬된 대화들을 바탕으로 사용자 필수 정보를 추출한다.
7. UDCS는 해당 데이터를 받아 사용자필수정보를 최신화시켜 지속적으로 앞으로 대화에 필요한 맥락들을 저장한다. 

> ***Q1. 어느정도의 성능 개선이 이루어졌는가요? (동일 API responseTime test 100회 수행)***
>
일상대화 : avg 3.2s
장보기 리스트 : avg 7.3s
레시피 추천 : avg 9.7s
전체 응답 평균 :  6.7s
> 

> ***Q2. 응답 속도가 빨라진 이유가 무엇인가요?
>
A.*** 일단 기본적으로 , 발화된 내용을 제공되는 기능별로 Intense를 나누는 것이 크게 작용한것 같습니다. 이전의 경우, 모든 대화 도메인에 대해서 스크립트를 생성하다보니 정확도도 크게 떨어지며, 고려해야될 데이터가 너무 방대하다보니 2분이상의 응답시간이 나왔었습니다. 하지만, 이제는 ‘오늘 뭐먹지?’ 와 같은 내용을 묻는다면 레시피추천을 해줘야하는 답변으로 Intense를 분석하고 레시피추천만을 위한 프롬프트를 이용해 레시피 추천에 대한 내용만 생성하면 되니 속도가 크게 개선되었습니다.
그리고 마지막으로 한번 대화할때마다, 저장해야될 사용자 필수 정보를 대화가 종료될때로 조건을 바꾸니 크게 향상되었습니다. 캐쉬된 데이터를 통해서도 충분히 맥락을 파악을 할 수 있기 때문에 생성된 대화의 질의 저하는 없었습니다.
>



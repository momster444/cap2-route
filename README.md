## Route

### Prerequiste
- Node.js (>= 8.x)
- MongoDB (>= 3.6.4)
### Install

- npm install

### Development
- npm start

### Insert Place to Database
- npm run insert-data

### Example
```
1. config/config.js 의 route_info 에 추가한다.

2. routes 에서 1에서적은 file 을 이름으로 해서 [file].js 생성

3. exports.[method] 로 함수를 만든다.

ex) exports.mypage = (req, res) => {
 }

4. res.render('뷰 이름');

5. views/ 에 가서 만들어 준다.
```

### 코드 정의

#### contenttypeid
- 12 (관광지)
- 14 (문화시설)
- 15 (축제)
- 28 (레포츠)
- 32 (숙박)
- 38 (쇼핑)
- 39 (음식점)


### API

- GET /basket (장바구니 가져오기)
  ##### response
  ```js
  {
    "start": ObjectId,
    "end": ObjectId,
    "places": [ObjectId]
  }
  ```

- PUT /basket (장바구니 업데이트)
  ##### request
  ```js
  {
    "start": ObjectId,
    "end": ObjectId,
    "place": ObjectId
  }
  ```

  ##### response
  ```js
  {
    "start": ObjectId,
    "end": ObjectId,
    "places": [ObjectId]
  }
  ```
- DELETE /basket (장바구니 모두 비우기)
  ##### response
  ```js
  {
    "start": null,
    "end": null,
    "places": []
  }
  ```

- DELETE /basket/places/:placeId(hex) (특정 장소 장바구니에서 제외)
  ##### response
  ```js
  {
    "start": ObjectId,
    "end": ObjectId,
    "places": [ObjectId]
  }
  ```


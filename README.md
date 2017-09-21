# Unagi Server
An express-js program as the backend server for Unagi application

## Documentation
To use the API and/or the complete Server follow this documentation:

#### 1. install
To use the server, clone it into your remote server and install npm packages:
```
   server$ git clone git@gitlab.rdcint.ir:CollegeNumber03/Server.git 
   server$ cd Server
   server$ npm install
```

#### 2. run
Now run the node project and leave it running in the background:
```
    server$ PORT=3000 node ./bin/www > logfile.log 2>&1 &
```

### API

#### V2(Depricated):
---
To use this server in your application see the table below:

NOTE: baseUrl is : ` http://IP:PORT/api/v{num}/ `
NOTE: num is the last versions number. right now its 2


**request**                | **request type** | **url**       | **headers**   | **query**         | **body**                                        | **parameters** | **response**                 |
-------------------------- | ---------------- | ------------  | ------------- | ----------------- | ----------------------------------------------- | -------------- | ---------------------------- |
get newest posts near user | GET              | baseUrl/post  | token: String | location^[1](#-note1-location-json-looks-like) : json | none                                            | none           | array of posts^[2](#-note2-post-json-looks-like) (JSON)      |
share a new post           | POST             | baseUrl/post  | token: String | location: json    | parentId: string, userId: string, content: string | none           | status(200) if ok            |
register new guest(token)  | GET              | baseUrl/user  | token: String | none              | none                                            | none           | status(200) if ok            |
register a new user        | POST             | baseUrl/user  | token: String | none              | username: string, password: string              | none           | token: string                |
~~get events of a post~~^[3](#-note3-get-events-of-a-post-is-deprecated)   | GET              | baseUrl/event | token: String | postId: string    | none                                            | none           | json containing all events   |
like a post(add an event)  | POST             | baseUrl/event | token: String | none              | type: string, postId: string, userId: string    | none           | array of posts(JSON)         |


##### * NOTE(1): location json looks like: 
```
    {
        longitude: 50,
        latitude: 30
    }
```
##### * NOTE(2): post json looks like:
```
    {
        postId: string,
        userId: string,
        content: string,
        parentId: string,
        location: json,
        date: Date,
        likes: number,
        score: number
    }
```
##### * NOTE(3): get events of a post is deprecated.
---
#### API V3
Download [this API](https://goo.gl/1quj7o) into your project directory and, require it where you want to use these methods:

* api.registerUser(username, password, uuid, optionals)
```
    params:
        * username
        * password
        * uuid: unique userId
        * optional: a json containing these elements:
            * name: a nickname for user
            * surname: surname for user
            * email
            * phone: phone number
```
* api.login(username, password, uuid)
```
    params:
        * username
        * password
        * uuid: unique userId
```
* api.getAccessToken(location, refreshToken, uuid)
```
    params:
        * location: a json containing these elements:
            * longitude: a number for geometric longitude
            * latitude: a number for geometric latitude
        * refreshToken: a token that expires every 10 days
        * uuid: unique userId
```
* api.getAllPosts(location, accessToken, postLimit, before, hot)
```
    params:
        * location: a json containing these elements:
            * longitude: a number for geometric longitude
            * latitude: a number for geometric latitude
        * accessToken: a token that expires every 30 minutes
        * postLimit: an optional argument for the number of posts that user fetches, default is 10
        * before: an argument with date format to fetch posts before this time
        * hot: a boolean argument, true means fetch hot posts
```
* api.submitPost(location, accessToken, content, parentId)
```
    params:
        * location: a json containing these elements:
            * longitude: a number for geometric longitude
            * latitude: a number for geometric latitude
        * accessToken: a token that expires every 30 minutes
        * content: a string of at most 160 characters
        * parentId: postId for the parent of this post, if it is in reply to a another post
```
* api.likePost(location, accessToken, postId)
```
    params:
        * location: a json containing these elements:
            * longitude: a number for geometric longitude
            * latitude: a number for geometric latitude
        * accessToken: a token that expires every 30 minutes
        * postId: the id of the post that the user is liking
```
* api.unlikePost(location, accessToken, postId)
```
    params:
        * location: a json containing these elements:
            * longitude: a number for geometric longitude
            * latitude: a number for geometric latitude
        * accessToken: a token that expires every 30 minutes
        * postId: the id of the post that the user is unliking
```




## To Do

- [x] token authentication
- [x] user-post-event models in db
- [x] handle saving new incoming posts
- [x] handle finding posts near a users location
- [x] send newest posts to users near the location of the posts
- [x] handle registering users
- [x] handle like events
- [x] calculate hot score for hot posts
- [x] implement RESTful server
- [x] make unittests
- [ ] prepare a proper documentation
- [ ] fix unitTests
- [ ] add username and password user authentication
- [ ] handle replying to posts
- [ ] find a better way to save likes and other events in database (phase 6)
- [ ] handle database layering with redis (phase 6)
- [ ] multi-step token authentication for securiry
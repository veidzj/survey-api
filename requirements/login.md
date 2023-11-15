# Login

> ## Success case:
1. ✅ Receives a **POST** type request on the **/api/login** route
2. ✅ Validate required data **email** and **password**
3. ✅ Validate that the **email** field is a valid email
4. ✅ Get the user with the provided email and password
5. ✅ Generate an access token from the user ID
6. ✅ Update user data with generated access token
7. ✅ Returns 200 with access token and user name

> ## Exceptions:
1. ✅ Returns 404 error if the API does not exist
2. ✅ Returns error 400 if **email** or **password** are not provided by the client
3. ✅ Returns error 400 if the **email** field is an invalid email
4. ✅ Returns 401 error if it does not find a user with the provided data
5. ✅ Returns error 500 if there is an error when trying to generate the access token
6. ✅ Returns error 500 if there is an error when trying to update the user with the generated access token

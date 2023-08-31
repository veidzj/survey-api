# Add Survey

> ## Success case:
1. ⛔️ Receives a **POST** request on the route **/api/surveys**
2. ⛔️ Validates if the request was made by an **admin**
3. ⛔️ Validates required data **question** and **answers**
4. ⛔️ **Creates** a survey with the provided data
5. ✅ Returns **204**, no data

> ## Exceptions:
1. ⛔️ Returns **404** error if API does not exist
2. ⛔️ Returns **403** error if user is not admin
3. ✅ Returns **400** error if question or answers are not provided by the client
4. ✅ Returns error **500** if there is an error when trying to create the survey

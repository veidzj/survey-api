# Survey Result

> ## Success case:
1. ✅ Receives a **GET** request in the route **/api/surveys/{survey_id}/results**
2. ✅ Validates whether the request was made by an **user**
3. ✅ Returns **200** with survey result data

> ## Exceptions:
1. ✅ Returns error **404** if the API does not exist
2. ✅ Returns error **403** if it's not an user
3. ✅ Returns error **500** if there is an error when trying to list the survey results

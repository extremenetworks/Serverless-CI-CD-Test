napi.get("/user/testa")
napi.post("/user").form({"userId": "testb", "email": "testaaa@test.com"})
napi.get("/user/testb")
napi.delete("/user/testb")

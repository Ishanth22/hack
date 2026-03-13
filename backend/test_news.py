import requests

r = requests.get('https://newsapi.org/v2/everything', params={
    'q': '"Nykaa" startup India',
    'apiKey': '7ade435ac16742389498e192d0c9c5b0',
    'pageSize': 5,
    'language': 'en',
    'sortBy': 'publishedAt'
})
print("STATUS:", r.status_code)
print("TEXT:", r.text)

import requests

url = "https://www.glassdoor.com/Overview/Working-at-DaVita-EI_IE1432.11,17.htm"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                  "AppleWebKit/537.36 (KHTML, like Gecko) "
                  "Chrome/114.0.0.0 Safari/537.36"
}

response = requests.get(url, headers=headers)

print("Status code:", response.status_code)

if response.status_code == 200:
    with open("davita_glassdoor.html", "w", encoding="utf-8") as f:
        f.write(response.text)
    print("HTML saved to davita_glassdoor.html")
else:
    print("Failed to fetch the page")

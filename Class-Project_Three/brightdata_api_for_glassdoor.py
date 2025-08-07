#code modified from https://brightdata.com/blog/web-data/how-to-scrape-glassdoor

import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env

def trigger_dataset(api_token, dataset_id, company_url):
    """
    Triggers a dataset using the BrightData API.

    Args:
    api_token (str): The API token for authentication.
    dataset_id (str): The dataset ID to trigger.
    company_url (str): The URL of the company page to analyze.

    Returns:
    dict: The JSON response from the API.
    """
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json",
    }
    payload = json.dumps([
        {
        "url": company_url,
         "days": 10000
        }
    ])
    response = requests.post(
        "https://api.brightdata.com/datasets/v3/trigger",
        headers=headers,
        params={"dataset_id": dataset_id},
        data=payload,
    )
    return response.json()

api_token = os.getenv("BRIGHTDATA_API_KEY")
dataset_id = "gd_l7j1po0921hbu0ri1z"
company_url = "https://www.glassdoor.com/Overview/Working-at-DaVita-EI_IE1432.11,17.htm"
response_data = trigger_dataset(api_token, dataset_id, company_url)
print(response_data)

#returned a snapshot ID
#run in terminal
#curl.exe -H "Authorization: Bearer BRIGHTDATA_API_KEY"
#"https://api.brightdata.com/datasets/v3/snapshot/{snapshot_ID}?format=json"
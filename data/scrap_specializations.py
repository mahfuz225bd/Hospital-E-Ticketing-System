import requests
from bs4 import BeautifulSoup, BeautifulStoneSoup

# specialities=[]

# def add_specialities(url):
#     # Fetch the HTML content from the provided URL
#     html_content = requests.get(url).content
    
#     # Parse the HTML content using BeautifulSoup
#     soup = BeautifulSoup(html_content, 'html.parser')

#     # Iterate through elements with class 'speciality'
#     for e in soup.select('.speciality'):
#         if e.text not in specialities:
#             specialities.append(e.text)

#     # Iterate through rows in the table with class 'doctors'
#     for e in soup.select('table.doctors tbody tr'):
#         # Get the text content of the second td element
#         spec = e.select('td')[1].text
#         if spec not in specialities:
#             specialities.append(spec)

def get_hospital_urls(url):
    result = []

    # Fetch the HTML content from the provided URL
    html_content = requests.get(url).content
    
    # Parse the HTML content using BeautifulSoup
    soup = BeautifulSoup(html_content, 'html.parser')

    # Iterate through elements with class 'list' and 'a'
    for link in soup.select('.list a'):
        hospital_url = link['href'].strip()

        result.append(hospital_url)

    return result

districts = [
    "https://www.doctorbangladesh.com/hospitals-dhaka/",
    "https://www.doctorbangladesh.com/hospitals-chittagong/",
    "https://www.doctorbangladesh.com/hospitals-sylhet/",
    "https://www.doctorbangladesh.com/hospitals-cumilla/",
    "https://www.doctorbangladesh.com/hospitals-narayanganj/",
    "https://www.doctorbangladesh.com/hospitals-rajshahi/",
    "https://www.doctorbangladesh.com/hospitals-rangpur/",
    "https://www.doctorbangladesh.com/hospitals-khulna/",
    "https://www.doctorbangladesh.com/hospitals-barisal/",
    "https://www.doctorbangladesh.com/hospitals-mymensingh/",
    "https://www.doctorbangladesh.com/hospitals-pabna/",
    "https://www.doctorbangladesh.com/hospitals-bogura/",
    "https://www.doctorbangladesh.com/hospitals-kushtia/"
]

hospital_urls = []

for district in districts:
    hospital_urls.append(get_hospital_urls(district))

all_urls = []

for each_url_set in hospital_urls:
    # append all hospital urls to all_urls
    all_urls += each_url_set

all_urls_dict = {k+1: v for k, v in enumerate(all_urls)}

for id in all_urls_dict:
    print(id)
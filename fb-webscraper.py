import requests
from selenium.webdriver import (Chrome, Firefox, ChromeOptions, FirefoxProfile)
import pymongo
import datetime
from bs4 import BeautifulSoup
import pandas as pd
import yaml
import time
import random

class FBWebScraper():

    def __init__(self):
        # Variables
        self.path_to_fb_login_yaml = "/Users/jasonli/.secrets/facebook-web-scrape-cred.yaml"
        self.my_profile_url = "https://www.facebook.com/jason.li.96930"

        # Initialize MongoDB
        self.mc = pymongo.MongoClient()
        self.db = self.mc['my-facebook-webscrape']
        self.fb_statuses = self.db['fb-statuses']

        self.my_password = ''
        self.my_email = ''

        self.friends_profiles_dict = {}

    def set_creds(self):
        with open(self.path_to_fb_login_yaml, 'r') as stream:
            try:
                y = yaml.load(stream)
                self.my_password = y['password']
                self.my_email = y['email']
            except yaml.YAMLError as exc:
                print(exc)

    def open_fb(self):
        # Choose a Browser:

        # CHROME
        # options = ChromeOptions();
        # options.add_argument("--disable-notifications");
        # browser = Chrome(options=options)

        # FIREFOX
        profile = FirefoxProfile();
        profile.set_preference("dom.webnotifications.enabled", False);
        browser = Firefox(firefox_profile=profile)

        # Login to FB in Selenium Browser
        url = 'https://www.facebook.com/'
        browser.get(url)

        email = browser.find_element_by_id('email')
        password = browser.find_element_by_id('pass')

        email.send_keys(self.my_email)
        password.send_keys(self.my_password)

        browser.find_element_by_id("loginbutton").click()

    def create_friends_dict(self):
        # Navigate to the friends tab in your profile
        browser.find_element_by_css_selector(f'a[href="{my_profile_url}"]').click()
        time.sleep(2)
        browser.find_element_by_css_selector('a[data-tab-key="friends"]').click()
        time.sleep(2)

        self.number_of_friends = int(browser.find_element_by_name('All Friends').find_elements_by_css_selector('span')[1].text)

        # Create a dictionary of friends and profile_urls,
        # where key=friend_name and value=friend_profile_url
        SCROLL_PAUSE_TIME = 1

        # Get scroll height
        last_height = browser.execute_script("return document.body.scrollHeight")

        # self.friends_profiles_dict = {}

        while len(self.friends_profiles_dict.items()) < self.number_of_friends:

            # Scroll down to bottom
            browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

            # Wait to load page
            time.sleep(SCROLL_PAUSE_TIME)


            friend_items = browser.find_elements_by_css_selector('div[data-testid=friend_list_item]')

            if len(self.friends_profiles_dict.items()) > self.number_of_friends:
                break

            for friend_item in friend_items:
                profile_links = friend_item.find_elements_by_css_selector('a')

                for profile in profile_links:
                    url = profile.get_attribute('href')

                    if (
                        my_profile_url not in url and
                        '?' in url and
                        'browse/mutual_friends/' not in url
                    ):
                        if not any(char.isdigit() for char in profile.text) or not profile.text:
                            if 'profile.php?id=' in url:
                                self.friends_profiles_dict[profile.text] = url
                            else:
                                s = url.split('?')[0]
                                self.friends_profiles_dict[profile.text] = s

            print('Creating friends dictionary... \n Friend count: ' +  str(len(self.friends_profiles_dict.items())) + ' friends.')

            # Calculate new scroll height and compare with last scroll height
            new_height = browser.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                print('Finished creating friends dictionary!')
                break
            last_height = new_height

        # Remove blank values
        self.friends_profiles_dict = {k: v for k, v in self.friends_profiles_dict.items() if k is not ''}

    def scrape_friends_statuses(self):
        # Web scrape each friend in friends dictionary, add statuses to mongoDB.
        # Data structure of each entry:
        #   {'name': STRING = name,
        #   'url': STRING = profile url,
        #   'datetime': DATETIME = current time,
        #   'statuses': DICT = {key=time of status post, value=status},
        #   'html': STRING = html of page,}

        number_of_statuses = 200

        min_scroll_time = 3

        # Iterate through each friend in the friends dictionary
        for name, url in self.friends_profiles_dict.items():
            person_dict = self.fb_statuses.find_one({"url": url})

        #     if person not in DB
            if person_dict == None:
                statuses_dict = {}
            else:
                statuses_dict = person_dict['statuses']

            browser.get(url)

            # Get scroll height
            last_height = browser.execute_script("return document.body.scrollHeight")

            # Scroll through friends timeline and add statuses to dictionary
            while len(statuses_dict.items()) < number_of_statuses:

                SCROLL_PAUSE_TIME = min_scroll_time * (1 + random.random())

                # Scroll down to bottom
                browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # Wait to load page
                time.sleep(SCROLL_PAUSE_TIME)

                posts = browser.find_elements_by_css_selector('div[id*=tl_unit]')

                for post in posts:
                    try:
                        post_time_element = post.find_element_by_css_selector('abbr')
                        post_time = post_time_element.get_attribute('title')
                        post_context = post.find_element_by_css_selector('h5')

                        # Conditionals to weed out non authored posts
                        if (post_time not in statuses_dict.keys() and
                            name in post_context.text and
                            'is with' not in post_context.text and
                            'was tagged' not in post_context.text and
                            'is in' not in post_context.text and
                            'to' not in post_context.text):

                            user_content_element = post.find_element_by_css_selector('div[class*=userContent]')
                            para_elements = user_content_element.find_elements_by_css_selector('p')

                            # Status sometimes split in two p elements. Merge two paragraphs
                            if len(para_elements) > 0:
                                text = ''
                                for para_element in para_elements:
                                    text += para_element.text + ' '

                            print('Time: ' + post_time + '\n' + 'Status: ' + text + '\n')

                            # Add status to dictionary
                            statuses_dict[post_time] = text
                    except:
                        pass
                print('Creating statuses dictionary for ' + name + '... \n' + 'Status count: ' +  str(len(statuses_dict.items())) + ' statuses.')


                # Calculate new scroll height and compare with last scroll height
                new_height = browser.execute_script("return document.body.scrollHeight")

                # Reached the end of friend's timeline, add name to already_scraped_dict
                if new_height == last_height:
                    print('Finished creating ' + name + ' statuses dictionary!')
                    # already_scraped_dict[name] = url
                    break
                last_height = new_height

            html = browser.page_source

            # Add entry to MongoDB
            self.fb_statuses.update_one(
                {'url': url},
                {'$set': {
                    'name': name,
                    'url': url,
                    'datetime': datetime.datetime.now(),
                    'statuses': statuses_dict,
                    'html': html,
                    }
                },
            upsert=True
            )

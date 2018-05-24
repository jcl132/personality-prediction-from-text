import requests
from selenium.webdriver import (Chrome, Firefox, ChromeOptions, FirefoxProfile)
import pymongo
import datetime
import yaml
import time
import random

class FBWebScraper():

    def __init__(self, my_email, my_password, my_profile_url, statuses=50, scroll_time=7, browser='Chrome'):

        self.my_email = my_email
        self.my_password = my_password
        self.my_profile_url = my_profile_url

        self.number_of_statuses = statuses
        self.scroll_time = scroll_time

        # Initialize MongoDB
        self.mc = pymongo.MongoClient()
        self.db = self.mc['my-facebook-webscrape']
        self.fb_statuses = self.db['fb-statuses']

        self.set_browser(browser)

        person_dict = self.fb_statuses.find_one({'friends_dict': {'$exists': True}})
        if person_dict == None:
            self.friends_dict = {}
        else:
            self.friends_dict = person_dict['friends_dict']

    # Sets the browser to scrape with
    def set_browser(self, browser):
        # CHROME
        if browser == 'Chrome':
            options = ChromeOptions();
            options.add_argument("--disable-notifications");
            self.browser = Chrome(options=options)

        # FIREFOX
        if browser == 'Firefox':
            profile = FirefoxProfile();
            profile.set_preference("dom.webnotifications.enabled", False);
            self.browser = Firefox(firefox_profile=profile)

    # Opens facebook in the browser
    def open_fb(self):
        # Login to FB in Selenium Browser
        url = 'https://www.facebook.com/'
        self.browser.get(url)

        email = self.browser.find_element_by_id('email')
        password = self.browser.find_element_by_id('pass')

        email.send_keys(self.my_email)
        password.send_keys(self.my_password)

        self.browser.find_element_by_id("loginbutton").click()

    # Creates a dictionary of friends and their profile links, where key=profile_url and value=friends_name
    def create_friends_dict(self):
        # Navigate to the friends tab in your profile
        self.browser.find_element_by_css_selector(f'a[href="{self.my_profile_url}"]').click()
        time.sleep(self.scroll_time)
        self.browser.find_element_by_css_selector('a[data-tab-key="friends"]').click()
        time.sleep(self.scroll_time)

        # Grab your number of friends from your profile
        self.number_of_friends = int(self.browser.find_element_by_name('All Friends').find_elements_by_css_selector('span')[1].text)

        # Get scroll height
        last_height = self.browser.execute_script("return document.body.scrollHeight")

        # Loop to scroll through friends list while length of friends dictionary < number of friends
        while len(self.friends_dict.items()) < self.number_of_friends:
            SCROLL_PAUSE_TIME = self.scroll_time * (1 + random.random())

            # Scroll down to bottom
            self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

            # Wait to load page
            time.sleep(SCROLL_PAUSE_TIME)

            # Grab all friends
            friend_items = self.browser.find_elements_by_css_selector('div[data-testid=friend_list_item]')

            # Iterate throguh friends list
            for friend_item in friend_items:
                # links associated with friend profile
                profile_links = friend_item.find_elements_by_css_selector('a')

                # Parse throguh friends item urls (not all urls link to their profile)
                for profile in profile_links:
                    url = profile.get_attribute('href')

                    # If this string is in the url, they do not have a custom profile url
                    if 'profile.php?id=' not in url:
                        url = url.split('?')[0]

                    # Rules for sorting out non profile urls
                    if (
                        self.my_profile_url not in url and
                        # '?' in url and
                        'browse/mutual_friends/' not in url and
                        url not in self.friends_dict.keys() and
                        profile.text is not "" and
                        not any(char.isdigit() for char in profile.text)
                    ):
                        # Add friend and profile url to dictionary
                        self.friends_dict[url] = profile.text
                        print('Adding ' + profile.text + ' to friends dictionary...')

            print('Creating friends dictionary... \nCurrent friend count: ' +  str(len(self.friends_dict.items())) + ' friends.')

            # Calculate new scroll height and compare with last scroll height
            new_height = self.browser.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                print('Finished creating friends dictionary! \nTotal friends: ' + str(len(self.friends_dict.items())))
                break
            last_height = new_height

        html = self.browser.page_source
        # Remove blank values
        # self.friends_dict = {k: v for k, v in self.friends_dict.items() if v is not ''}
        self.fb_statuses.insert({
            'friends_dict': self.friends_dict,
            'datetime': datetime.datetime.now(),
            'html': html
        }, check_keys=False)

    def scrape_friends_statuses(self):
        # Web scrape each friend in friends dictionary, add statuses to mongoDB.
        # Data structure of each entry:
        #   {'name': STRING = name,
        #   'url': STRING = profile url,
        #   'datetime': DATETIME = current time,
        #   'statuses': DICT = {key=time of status post, value=status},
        #   'html': STRING = html of page,}


        # Iterate through each friend in the friends dictionary
        for url, name in self.friends_dict.items():
            person_dict = self.fb_statuses.find_one({"url": url})

        #     if person not in DB
            if person_dict == None:
                statuses_dict = {}
            else:
                statuses_dict = person_dict['statuses']

            self.browser.get(url)

            time.sleep(self.scroll_time)

            # Get scroll height
            last_height = self.browser.execute_script("return document.body.scrollHeight")

            # Scroll through friends timeline and add statuses to dictionary
            while len(statuses_dict.items()) < self.number_of_statuses:

                SCROLL_PAUSE_TIME = self.scroll_time * (1 + random.random())

                # Scroll down to bottom
                self.browser.execute_script("window.scrollTo(0, document.body.scrollHeight);")

                # Wait to load page
                time.sleep(SCROLL_PAUSE_TIME)

                posts = self.browser.find_elements_by_css_selector('div[id*=tl_unit]')

                for post in posts:
                    try:
                        post_time_element = post.find_element_by_css_selector('abbr')
                        post_time = post_time_element.get_attribute('title')
                        post_context = post.find_element_by_css_selector('h5')

                        try:
                            to_element = post_context.find_element_by_css_selector('i')
                            has_to_element = True
                        except:
                            has_to_element = False

                        # Conditionals to weed out non authored posts
                        if (post_time not in statuses_dict.keys() and
                            name in post_context.text and
                            'is with' not in post_context.text and
                            'was tagged' not in post_context.text and
                            'is in' not in post_context.text and
                            not has_to_element):

                            user_content_element = post.find_element_by_css_selector('div[class*=userContent]')
                            para_elements = user_content_element.find_elements_by_css_selector('p')

                            # Status sometimes split in two p elements. Merge two paragraphs
                            if len(para_elements) > 0:
                                text = ''
                                for para_element in para_elements:
                                    text += para_element.text + ' '

                            print('Date: ' + post_time + '\n' + 'Status: ' + text + '\n')

                            # Add status to dictionary
                            statuses_dict[post_time] = text
                    except:
                        print('Elements Not Found')
                print("Scraping " + name + "'s statuses... \n" + 'Current status count: ' +  str(len(statuses_dict.items())) + ' statuses.')

                time.sleep(self.scroll_time)

                # Calculate new scroll height and compare with last scroll height
                new_height = self.browser.execute_script("return document.body.scrollHeight")

                # Reached the end of friend's timeline, add name to already_scraped_dict
                if new_height == last_height:
                    break
                last_height = new_height

            html = self.browser.page_source

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
            print("Finished creating " + name + "'s statuses dictionary! \nStatus count: " + str(len(statuses_dict.items())) + " statuses.")

if __name__ == '__main__':
    with open('fb_login_creds.yaml', 'r') as stream:
        try:
            y = yaml.load(stream)
            my_password = y['password']
            my_email = y['email']
            my_profile_url = y['profile_url']
        except yaml.YAMLError as exc:
            print(exc)

    FBWS = FBWebScraper(
        my_email=my_email,
        my_password=my_password,
        my_profile_url=my_profile_url,
        browser='Firefox'
    )

    FBWS.open_fb()
    if FBWS.friends_dict == {}:
        FBWS.create_friends_dict()
    FBWS.scrape_friends_statuses()

"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
      <button id="delete" class="delete-btn hidden">X</button>
      <button id="fav-story" class="btn-star star">&#9734</button>
      <button id="fav-story" class="btn-star starf hidden">&#9733; </button>

        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$("#new-story-btn").on("click", async function getAndAddNewStories(evt) {
  evt.preventDefault();
  const author = $("#story-author").val();
  const title = $("#story-title").val();
  const url = $("#story-url").val();
  const newStory = await storyList.addStory(currentUser, {
    title,
    author,
    url,
  });
  const story = generateStoryMarkup(newStory);
  $allStoriesList.append(story);
  $newStoryForm.hide();
});

function putFavoritesStoriesOnPage() {
  console.debug("putFavoritesStoriesOnPage");
  $favStoryList.empty();
  if (currentUser.favorites.lenght === 0) {
    $favStoryList.append("<p>No stories added</p>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favStoryList.append($story);
    }
  }
  $favStoryList.show();
}

async function toggleStoryFavorites(evt) {
  console.debug("toggleStoryFavorites");
  const $tar = $(evt.target);
  const $closestLi = $tar.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($tar.hasClass("starf")) {
    await currentUser.removeStoryFromFav(story);
    $(".star").show();
    $(".starf").hide();
  } else if ($tar.hasClass("star")) {
    await currentUser.addStoryToFav(story);
    $(".starf").show();
    $(".star").hide();
  }
}

$storiesList.on("click", ".btn-star", toggleStoryFavorites);

function putUserStoriesInPage() {
  console.debug("putUserStoriesInPage");
  $myStoryList.empty();
  if (currentUser.ownStories.lenght === 0) {
    $myStoryList.append(`<p>There are no stories added</p>`);
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $myStoryList.append($story);
    }
  }
  $myStoryList.show();
}

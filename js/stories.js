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
  const isFavorite = currentUser.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return $(`
      <li id="${story.storyId}">
      <button id="delete" class="delete-btn hidden">&#10008;</button>
      <span class="star">
      <i class="${starType} fa-star" aria-hidden="true"></i>
      </span>

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

function putUserStoriesOnPage() {
  console.debug("putUserStoriesInPage");
  $(`.my-stories-list`).empty();
  if (currentUser.ownStories.length === 0) {
    const $pl = $(`<p>There are no stories added</p>`);
    $(`.my-stories-list`).append($pl);
  } else {
    for (let story of currentUser.ownStories) {
      const $story = generateStoryMarkup(story);
      $(`.my-stories-list`).append($story);
      $(`.delete-btn`).show();
    }
  }
  $(`.my-stories-list`).show();
}

function putFavoritesStoriesOnPage() {
  console.debug("putFavoritesStoriesOnPage");
  $(`.fav-stories-list`).empty();
  if (currentUser.favorites.length === 0) {
    let $p = $(`<p> No stories added to favorites!</p>`);
    $(`.fav-stories-list`).append($p);
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $(`.fav-stories-list`).append($story);
    }
  }
  $(`.fav-stories-list`).show();
}

async function toggleStoryFavorites(evt) {
  console.debug("toggleStoryFavorites");
  const $tar = $(evt.target);
  const $closestLi = $tar.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find((s) => s.storyId === storyId);

  if ($tar.hasClass("fas")) {
    await currentUser.removeStoryFromFav(story);
    $tar.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addStoryToFav(story);
    $tar.closest("i").toggleClass("fas far");
  }
}

$storiesList.on("click", ".star", toggleStoryFavorites);

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
  $allStoriesList.prepend(story);
  $newStoryForm.hide();
});

async function removeStoryFromUserStoryList(evt) {
  const $tar = $(evt.target);
  const $closestLi = $tar.closest("li");
  const storyId = $closestLi.attr("id");
  await storyList.removeStory(currentUser, storyId);
  putUserStoriesOnPage();
}

$(`.my-stories-list`).on("click", ".delete-btn", removeStoryFromUserStoryList);

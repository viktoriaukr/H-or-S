"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
  $(`.fav-stories-list`).hide();
  $(`#my-stories-list`).hide();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitLinkClick(evt) {
  console.debug("submitLinkClick", evt);
  hidePageComponents();
  $newStoryForm.show();
  $allStoriesList.show();
  $(`.fav-stories-list`).hide();
  $(`#my-stories-list`).hide();
}

$body.on("click", "#nav-submit", submitLinkClick);

function openFavoritesPage(evt) {
  console.debug("openFavoritesPage", evt);
  hidePageComponents();
  putFavoritesStoriesOnPage();
  $(`#my-stories-list`).hide();
  $(`.fav-stories-list`).show();
}

$body.on("click", "#nav-favorites", openFavoritesPage);

function openMyStoryList(evt) {
  console.debug("openMyStoryList", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $(`.fav-stories-list`).hide();
  $(`#my-stories-list`).show();
}

$body.on("click", "#nav-my-story", openMyStoryList);

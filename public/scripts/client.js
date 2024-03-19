
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// eslint-disable-next-line no-undef
$(() => {

  $.getJSON('/tweets', (data) => {
    clearTweets();
    data.sort((a, b) => b.created_at - a.created_at);
    renderTweets(data);
    $('time.tweet__age').timeago();
  });

  $('.new-tweet form').submit(function(event) {
    event.preventDefault();
    const tweetText = $(this).serialize();


    $.post('/tweets', tweetText, (data) => {
      $.getJSON('/tweets', (data) => {
        clearTweets();
        data.sort((a, b) => b.created_at - a.created_at);
        renderTweets(data);
        $('time.tweet__age').timeago();
      });
    });

    $('.new-tweet__inputtext').val('');
    $('.new-tweet__counter').text('140');
  });


});

const clearTweets = () => {
  $('.tweet-container').empty();
};

const renderTweets = (tweets) => {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweet-container').append($tweet);
  }
};


const createTweetElement = (tweet) => {
  const when = new Date(tweet.created_at);

  return $(`
  <article class="tweet">
        <header>
          <div class="tweet__profile">
            <img src="${tweet.user.avatars}" alt="author avatar"/>
            <div>${tweet.user.name}</div>
          </div>
          <div class="tweet__handle">${tweet.user.handle}</div>
        </header>
        <div class="tweet__tweet">
          <p>${tweet.content.text}</p>
        </div>
        <footer>
          <time class="tweet__age" datetime="${when.toISOString()}">${when.toLocaleString()}</time>
          <div class="tweet__actions">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart">
              <span class="count">1</span>
            </i>
          </div>
        </footer>
        </div>
      </article>`);
};

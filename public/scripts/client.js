
/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// eslint-disable-next-line no-undef
$(() => {

  loadTweets();


  $('.new-tweet form').submit(function(event) {
    event.preventDefault();
    const tweetText = $(this).serialize();


    $.post('/tweets', tweetText, (data) => {
      $.getJSON('/tweets', (data) => {
        clearTweets();
        data.sort((a, b) => b.created_at - a.created_at);
        renderTweets(data);

      });
    });

    $('.new-tweet__inputtext').val('');
    $('.new-tweet__counter').text('140');
  });


});

const loadTweets = () => {
  $.getJSON('/tweets')
  .done((data) => {
    clearTweets();
    data.sort((a, b) => b.created_at - a.created_at);
    renderTweets(data);
  })
  .fail((jqXHR, status, err) => {
    console.log("Error loading tweets");
    console.log('Error:', status, err);
  });
};

const clearTweets = () => {
  $('.tweet-container').empty();
};

const renderTweets = (tweets) => {
  for (const tweet of tweets) {
    const $tweet = createTweetElement(tweet);
    $('.tweet-container').append($tweet)

  }
};


const createTweetElement = (tweet) => {

  // if empty tweet, return
  if(!tweet || !tweet.content || !tweet.content.text || !tweet.user || !tweet.user.name || !tweet.user.handle || !tweet.created_at) {
    return;
  };

  const whenDate = new Date(tweet.created_at);
  let whenString = sanitize(tweet.created_at);

  // if valid date, generate timeago string or locale string if timeago is not defined
  if(whenDate instanceof Date && !isNaN(whenDate)) {
    whenString = timeagoFail ?  whenDate.toLocaleString() : timeago.format(whenDate);
  }



  return $(`
  <article class="tweet">
        <header>
          <div class="tweet__profile">
            <img src="${sanitize(tweet.user.avatars)}" alt="author avatar"/>
            <div>${sanitize(tweet.user.name)}</div>
          </div>
          <div class="tweet__handle">${sanitize(tweet.user.handle)}</div>
        </header>
        <div class="tweet__tweet">
          <p>${sanitize(tweet.content.text)}</p>
        </div>
        <footer>
          <time class="tweet__age" datetime="${whenDate}">${whenString}</time>
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

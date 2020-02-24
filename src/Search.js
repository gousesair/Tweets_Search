import React, { Component } from "react";
import "./Search.css";
import { Button, Input, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import twitter from "./images/twitter.jpg";
// import axios from "axios";
import Twitter from "twitter";
import { result } from "./result.js";
import Typography from "@material-ui/core/Typography";
import TwitterLogin from "react-twitter-auth/lib/react-twitter-auth-component.js";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      main: "#212121"
    }
  }
});

class Search extends Component {
  constructor(props) {
    super(props);
    this.config = {
      consumer_key: "kpvbaBGai0Q2TPBGUeg7qFjIl",
      consumer_secret: "wk57m3luj3rSKLaSHZnt1XKG1kGknIHAOZ0NiBly0pbJ4Kb1Et",
      access_token_key: "2901377492-OHP50NIDv0DHc38REMshe28gHAQaAUKGVgMeNd6",
      access_token_secret: "EzdS1aWceuTeYZSroOVxVpKKYwvsOAhjxJzjmLjfs3MUh"
    };
    this.Client = new Twitter(this.config);
    this.searchTwitter = this.searchTwitter.bind(this);
  }
  state = {
    keyValue: "",
    tweets: [],
    token: "",
    consumer_key: "kpvbaBGai0Q2TPBGUeg7qFjIl",
    consumer_secret: "wk57m3luj3rSKLaSHZnt1XKG1kGknIHAOZ0NiBly0pbJ4Kb1Et",
    access_token_key: "2901377492-OHP50NIDv0DHc38REMshe28gHAQaAUKGVgMeNd6",
    access_token_secret: "EzdS1aWceuTeYZSroOVxVpKKYwvsOAhjxJzjmLjfs3MUh"
  };

  handleBearerToken = () => {
    const getBearerToken = require("get-twitter-bearer-token");

    const twitter_consumer_key = this.state.consumer_key;
    const twitter_consumer_secret = this.state.consumer_secret;

    getBearerToken(
      twitter_consumer_key,
      twitter_consumer_secret,
      (err, res) => {
        if (err) {
          // handle error
          console.log("Error ", err);
        } else {
          // bearer token
          console.log("Hello ", res.body.access_token);
        }
      }
    );
  };
  handleOnChange = event => {
    this.setState({ keyValue: event.target.value });
  };

  handleSearch = () => {
    this.makeApiCall(this.state.keyValue);
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.searchTwitter(this.state.keyValue);
    }
  };

  tweetsDisplay = () => {
    if (this.state.tweets) {
      return (
        <div>
          {this.state.tweets.map(tweets => (
            <div>
              <br />
              <Typography
                color="inherit"
                variant="body2"
                component="span"
                inline
              >
                {tweets.text}
              </Typography>
              <br />
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <Typography color="inherit" variant="body2" component="span" inline>
          Sorry no tweets with that keyword
        </Typography>
      );
    }
  };

  makeApiCall = searchInput => {
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const searchUrl = `https://api.twitter.com/1.1/search/tweets.json?q='${searchInput}'`;
    const secondsSinceEpoch = Math.round(Date.now() / 1000);
    fetch(proxyurl + searchUrl, {
      method: "get",
      headers: new Headers({
        Authorization: `OAuth oauth_consumer_key="fO7VF35dTiHYGuak4zC6kUudN",oauth_token="2901377492-54xsTjQNJ9SxK0khck2nJ2NEPCBewxLnamZ74VY",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${secondsSinceEpoch}",oauth_nonce="kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",oauth_version="1.0",oauth_signature="OEYWtUSRTVExkP%2FYvYKOkN7cSqg%3D"`
      })
    })
      .then(response => {
        return response.json();
      })
      .then(
        response => {
          response = response.data;
          this.setState({ tweets: response.statuses });
        },
        error => {
          const status = error;
          console.log(status);
          this.setState({ tweets: result });
        }
      );
  };
  searchTwitter(key) {
    // this.setState({tweets:result});
    console.log(this.state.tweets);
    this.Client.get("search/tweets", { q: key }, function(
      error,
      tweets,
      response
    ) {
      this.setState({ tweets: tweets });
      console.log("error::::::", error);
      console.log(tweets);
    });
  }

  render() {
    this.handleBearerToken();

    return (
      <>
        <div className="main">
          <p>
            TWEET
            <img src={twitter} alt="Twitter Icon" align="middle" />
            SEARCH
          </p>
          <div className="container">
            <ThemeProvider theme={theme}>
              <Input
                color="secondary"
                id="input-with-icon-adornment"
                startAdornment={
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                }
                onChange={event => this.handleOnChange(event)}
                value={this.state.keyValue}
                onKeyDown={this.handleKeyDown}
              />
              <br />
              <br />
              <Button
                variant="contained"
                size="medium"
                color="primary"
                onClick={this.handleSearch}
              >
                Search
              </Button>
            </ThemeProvider>
          </div>
          {this.tweetsDisplay()}
        </div>
      </>
    );
  }
}
export default Search;

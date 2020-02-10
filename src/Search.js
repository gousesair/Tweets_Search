import React, { Component } from "react";
import "./Search.css";
import { Button, Input, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import twitter from "./images/twitter.jpg";
import axios from "axios";
// import Twitter from "twitter";
import { result } from "./result.js";
import Typography from "@material-ui/core/Typography";

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      main: "#212121"
    }
  }
});

class Search extends Component {
  // constructor(props) {
  //   super(props);
  //   this.config = {
  //     consumer_key: "fO7VF35dTiHYGuak4zC6kUudN",
  //     consumer_secret: "3VdRdbjFhSsQZrlCCGndAKEUHsuekeXl4Qdiw3HdTqSI1BFtUH",
  //     access_token_key: "2901377492-54xsTjQNJ9SxK0khck2nJ2NEPCBewxLnamZ74VY",
  //     access_token_secret: "NX9Z2JDv1qhxj9DYg1Uj74iSEIWvOu0QrKiry95L0UvWI"
  //   };
  //   this.Client = new Twitter(this.config);
  //   this.searchTwitter = this.searchTwitter.bind(this);
  // }
  state = { keyValue: "", tweets: [] };

  handleOnChange = event => {
    this.setState({ keyValue: event.target.value });
  };

  handleSearch = () => {
    this.makeApiCall(this.state.keyValue);
  };

  handleKeyDown = e => {
    if (e.key === "Enter") {
      this.makeApiCall(this.state.keyValue);
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
    const searchUrl = `https://api.twitter.com/1.1/search/tweets.json?q='${searchInput}'`;
    axios
      .get(searchUrl, {
        headers: {
          Authorization: `"OAuth oauth_consumer_key="fO7VF35dTiHYGuak4zC6kUudN",oauth_token="2901377492-54xsTjQNJ9SxK0khck2nJ2NEPCBewxLnamZ74VY",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1581081125",oauth_nonce="ABCDEFGHIJKLMNOPQRSTUVWXYZ123456",oauth_version="1.0",oauth_signature="OEYWtUSRTVExkP%2FYvYKOkN7cSqg%3D",oauth_signature_method="HMAC-SHA1""`
        }
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
  // searchTwitter(key) {
  //   // this.setState({tweets:result});
  //   console.log(this.state.tweets);
  //   this.Client.get("search/tweets", { q: key }, function(
  //     error,
  //     tweets,
  //     response
  //   ) {
  //     console.log("error::::::", error);
  //     console.log(tweets);
  //   });
  // }

  render() {
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

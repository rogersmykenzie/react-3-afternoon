import React, { Component } from 'react';
import Post from './Post/Post'
import axios from 'axios';
import './App.css';

import Header from './Header/Header';
import Compose from './Compose/Compose';

const baseURL = "https://practiceapi.devmountain.com/api"

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
      previousText: ''
    };

    this.updatePost = this.updatePost.bind( this );
    this.deletePost = this.deletePost.bind( this );
    this.createPost = this.createPost.bind( this );
    this.organizePosts = this.organizePosts.bind( this );
  }
  
  componentDidMount() {
    axios.get(`${baseURL}/posts`).then(response => {
      this.setState({posts: response.data});
    })
  }

  organizePosts(text) {
    if(this.state.posts.length===0) {
      axios.get(`${baseURL}/posts`).then(response => {
        this.setState({posts: response.data});
      })
    }
    let arr = this.state.posts.filter((val => {
      console.log(val);
      return val.text.toLowerCase().includes(text.toLowerCase());
    }));
    this.setState({posts: arr, previousText: text});
  }
  updatePost(id, text) {
      axios
      .put(`https://practiceapi.devmountain.com/api/posts?id=${id}`, {text})
      .then(response => {
        this.setState({
          posts: response.data
        })
      }).catch(err => {
        console.dir(err);
      })
  }

  deletePost(id) {
    axios.delete(`${baseURL}/posts?id=${id}`).then(response => {
      this.setState({posts: response.data});
    })
  }

  createPost(text) {
    axios.post(`${baseURL}/posts`, { text }).then((response) => {
      this.setState({ posts: response.data });
    })
  }

  render() {
    const postie = this.state.posts.map((val, i, arr) => {
      return <Post key={i} id={val.id} text={val.text} date={val.date} updatePostFn={this.updatePost} deletePostFn={this.deletePost}/>
    })
    const { posts } = this.state;

    return (
      <div className="App__parent">
        <Header organizePosts={this.organizePosts}/>

        <section className="App__content">

          <Compose createPostFn={this.createPost}/>
          {postie}
        </section>
      </div>
    );
  }
}

export default App;

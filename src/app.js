import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';

class Article extends React.Component {
  render() {
    return (
      <div className="article">
        <div className="h1">
          <h1>{this.props.value.h1}</h1>
        </div>
        <div className="h2">
          <h2>{this.props.value.h2}</h2>
        </div>
        <div className="image">
          <img src={this.props.value.image} alt={this.props.value.alt} width='300px' height='300px'></img>
        </div>
        <div className="link">
          <a href={this.props.value.link}>Fiit</a>
        </div>
      </div>
    );
  }
}

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [
        {
          h1: "test1",
          h2: "sub_test1",
          image: "https://creativecommons.org/wp-content/uploads/2018/03/legal_logo-1.png",   // Ak nejde link radšej nájsť iný, krajne HTTP proxy cez nodejs
          alt: "CC",
          link: "https://www.fiit.stuba.sk"       // bez httos://www posiela na lokálny / =》 very useful
        },
        {
          h1: "test2",
          h2: "sub_test2",
          image: "https://upload.wikimedia.org/wikipedia/commons/5/55/The_Arecibo_Observatory_20151101114231-0_8e7cc_c7a44aca_orig.jpg",
          alt: "Satellite?",
          link: "https://www.fiit.stuba.sk"  
        },
        {
          h1: "test1",
          h2: "sub_test1",
          image: "https://live.staticflickr.com/75/204420128_9e0431ee56_b.jpg",
          alt: "REACT",
          link: "https://www.fiit.stuba.sk"  
        }
      ],
    };
  }


  render() {
    return (
      <div className="list">
        <div className="article-list">
          <Article
           value={this.state.articles[0]}
          />
          <Article
           value={this.state.articles[1]}
          />
          <Article
           value={this.state.articles[2]}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<List />, document.getElementById("root"));

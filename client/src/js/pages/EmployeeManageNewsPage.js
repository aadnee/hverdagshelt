import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Divider, Header, Message, Segment, Grid } from 'semantic-ui-react';
import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { newsService } from '../services/NewsServices';
import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';

//import {} from './../widgets';

export class EmployeeManageNewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: []
    };
  }

  componentWillMount() {
    let catIds = [];
    let news = [];
    categoryService
      .getCategories()
      .then(res => {
        res.data.map(c => {
          catIds.push(c.id);
        });
      })
      .then(() => {
        //change Cookies.get('municipalId) with Consumer._currentValue.user.municipalId
        //didnt work for me
        newsService.getFilteredNews(Cookies.get('municipalId'), catIds, 0, 0).then(res => {
          news = res.data;
          this.setState({ news: news });
          console.log(this.state.news);
        });
      });
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Administrer nyheter for din kommune</Header>
        <Segment color="blue" basic />
        <Grid container centered>
          {this.state.news.length < 1 ? (
            <Grid.Row centered>
              <Message size={'massive'}>
                <p>Du har ingen nyheter å administrere</p>
              </Message>
            </Grid.Row>
          ) : null}
          {this.state.news.map(news => {
            return (
              <Grid.Row key={news.id}>
                <NewsCaseWidget newscase={news} employee />
              </Grid.Row>
            );
          })}
        </Grid>
      </Container>
    );
  }
}

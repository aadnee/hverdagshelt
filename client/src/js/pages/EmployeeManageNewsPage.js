import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Divider, Header, Message, Segment, Grid, Label } from 'semantic-ui-react';
import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { newsService } from '../services/NewsServices';
import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

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
          c.subs.map(subCat => {
            catIds.push(subCat.id);
          });
        });
      })

      .then(() => {
        //change Cookies.get('municipalId) with Consumer._currentValue.user.municipalId
        //didnt work for me
        newsService.getFilteredNews(1, catIds, 0, 0).then(res => {
          news = res.data;

          this.setState({ news: news });
        });
      });
  }

  editNews(id, title, description, category, status, published, company) {
    console.log('cat ' + category, 'status' + status, 'company' + company);

    newsService.updateNews(id, title, description, category, status, published, company).then(res => {
      if (res.success) {
        let index = -1;
        this.state.news.map((news, i) => (news.id === id ? (index = i) : null));
        let news = this.state.news;
        news[index].title = title;
        news[index].description = description;
        news[index].categoryId = category;
        news[index].status = status;
        news[index].published = published;
        news[index].companyId = company;
        this.setState({ news: news });

        toast.success(res.message.no);
      } else {
        toast.error(res.message.no);
      }
    });
  }

  render() {
    return (
      <Container>
        <Divider hidden />
        <Divider hidden />
        <Header as="h1">Administrer nyheter for din kommune</Header>
        <Segment color="blue" basic />

        <Grid container>
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
                <NewsCaseWidget newscase={news} employee editNews={this.editNews.bind(this, news.id)} />
              </Grid.Row>
            );
          })}
        </Grid>
      </Container>
    );
  }
}

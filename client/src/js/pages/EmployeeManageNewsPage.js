import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { Container, Divider, Header, Message, Segment, Grid, Label } from 'semantic-ui-react';
import { NewsCaseWidget } from '../widgets/NewsCaseWidget';
import { newsService } from '../services/NewsServices';
import { categoryService } from '../services/CategoryServices';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { companyService } from '../services/CompanyServices';

//import {} from './../widgets';

export class EmployeeManageNewsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: [],
      companies: [],
      companyOptions: [],
      executedBy: ''
    };
  }

  componentWillMount() {
    let catIds = [];
    let news = [];
    let companies = [];
    let companyOptions = [];
    let executedBy = '';
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
        companyService.getCompanies().then(res => {
          companies = res.data;
          res.data.map(comp => {
            companyOptions.push({ key: comp.id, value: comp.id, text: comp.name });
          });
        });
      })
      .then(() => {
        //change Cookies.get('municipalId) with Consumer._currentValue.user.municipalId
        newsService.getFilteredNews(1, catIds, 0, 0).then(res => {
          news = res.data;
          news.map((n, i) => {
            if (n.companyId) {
              let company = companies.find(comp => comp.id === n.companyId);
              news[i].executedBy = company.name;
            }
          });
          this.setState({ news: news, companies: companies, companyOptions: companyOptions, executedBy: executedBy });
        });
      });
  }

  editNews(id, title, description, category, published) {
    newsService.updateNews(id, title, description, category, published).then(res => {
      if (res.success) {
        let index = -1;
        this.state.news.map((news, i) => (news.id === id ? (index = i) : null));
        let news = this.state.news;
        news[index].title = title;
        news[index].description = description;
        news[index].categoryId = category;
        news[index].published = published;
        this.setState({ news: news });
        toast.success(res.message.no);
      } else {
        toast.error(res.message.no);
      }
    });
  }

  setStatus(id) {
    return newsService.finishNews(id).then(res => {
      if (res.success) {
        let index = -1;
        this.state.news.map((news, i) => (news.id === id ? (index = i) : null));
        let news = this.state.news;
        news[index].status = 3;
        this.setState({ news: news });

        toast.success(res.message.no);
        return true;
      } else {
        toast.error(res.message.no);
      }
    });
  }

  sendToCompany(id, companyId, companyName) {
    return newsService.assignCompany(id, companyId).then(res => {
      if (res.success) {
        let index = -1;
        this.state.news.map((news, i) => (news.id === id ? (index = i) : null));
        let news = this.state.news;
        news[index].companyId = id;
        news[index].executedBy = companyName;
        this.setState({ news: news });
        toast.success(res.message.no);
        return true;
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
                <NewsCaseWidget
                  newscase={news}
                  employee
                  editNews={this.editNews.bind(this, news.id)}
                  setStatus={this.setStatus.bind(this, news.id)}
                  sendToCompany={this.sendToCompany.bind(this, news.id)}
                  companies={this.state.companies}
                  companyOptions={this.state.companyOptions}
                  executedBy={this.state.executedBy}
                />
              </Grid.Row>
            );
          })}
        </Grid>
      </Container>
    );
  }
}

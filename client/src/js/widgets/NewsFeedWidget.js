import React from 'react';
import { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  Segment,
  Header,
  Icon,
  Dropdown,
  Button,
  Grid,
  Divider,
  Message,
  Pagination,
  Container
} from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { Consumer } from './../context';

import { municipalService } from './../services/MunicipalServices';
import { categoryService } from './../services/CategoryServices';
import { subscriptionService } from './../services/SubscriptionServices';
import { newsService } from './../services/NewsServices';
import { userService } from './../services/UserServices';

import { NewsCaseWidget } from './NewsCaseWidget';

export class NewsFeedWidget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      municipals: [],
      selectedMunicipals: [],
      categories: [],
      selectedCategories: [],
      news: [],
      subs: [],
      empty: false,
      ready: false,
      roof: this.props.roof || 0,
      page: 1,
      activePage: 0,
      totalPages: 0
    };
  }

  componentWillMount() {
    this.setState({ loading: true });
    if (Consumer._currentValue.user) {
      let munRes = municipalService
        .getMunicipals()
        .then(municipals => {
          userService
            .getMunicipals()
            .then(myMunicipals => {
              let allMunicipals = municipals.data.map(m => {
                return { key: m.id, value: m.id, text: m.name };
              });
              let allMyMunicipals = myMunicipals.data.map(m => {
                return m.id;
              });
              this.setState({ municipals: allMunicipals, selectedMunicipals: allMyMunicipals });
              return allMunicipals;
            })
            .catch(res => console.error(res));
        })
        .catch(res => console.error(res));

      let catRes = categoryService
        .getCategories()
        .then(res => {
          let cats = res.data.map(r => {
            return { key: r.id, value: r.id, text: r.name };
          });
          this.setState({ categories: cats });
          return cats;
        })
        .catch(res => console.error(res));

      let subRes = subscriptionService
        .getSubscriptions()
        .then(res => {
          let subs = res.data.map(r => r.id);
          this.setState({ subs: subs });
          return subs;
        })
        .catch(res => console.error(res));

      Promise.all([munRes, catRes, subRes])
        .then(() => {
          this.getNews();
        })
        .then(() => {
          this.setState({ ready: true });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });
    } else {
      let munRes = municipalService
        .getMunicipals()
        .then(municipals => {
          let allMunicipals = municipals.data.map(m => {
            return { key: m.id, value: m.id, text: m.name };
          });
          let allMyMunicipals = municipals.data.map(m => {
            if (m.id == 1) {
              //TRONDHEIM KOMMUNE = 1
              return m.id;
            }
          });
          this.setState({ municipals: allMunicipals, selectedMunicipals: allMyMunicipals });
          return allMunicipals;
        })
        .catch(res => console.error(res));

      let catRes = categoryService
        .getCategories()
        .then(res => {
          let cats = res.data.map(r => {
            return { key: r.id, value: r.id, text: r.name };
          });
          this.setState({ categories: cats });
          return cats;
        })
        .catch(res => console.error(res));

      Promise.all([munRes, catRes])
        .then(() => {
          this.getNews();
        })
        .then(() => {
          this.setState({ ready: true });
        })
        .catch(err => {
          console.log(err);
          this.setState({ loading: false });
        });
    }
  }

  getNews() {
    if (!this.props.archive) {
      this.setState({ loading: true });
      setTimeout(() => {
        const munsearch =
          this.state.selectedMunicipals.length > 0
            ? this.state.selectedMunicipals
            : this.state.municipals.map(m => m.key);
        const catsearch =
          this.state.selectedCategories.length > 0
            ? this.state.selectedCategories
            : this.state.categories.map(c => c.key);

        newsService.getFilteredNews(munsearch, catsearch, 0, 0).then(res => {
          if (res.success) {
            this.setState({
              news: res.data,
              loading: false,
              totalPages: Math.ceil(res.data.length / 6),
              activePage: 1
            });
          } else {
            this.setState({ loading: false });
          }
        });
      }, 10);
    } else {
      this.setState({ loading: true });
      setTimeout(() => {
        const munsearch =
          this.state.selectedMunicipals.length > 0
            ? this.state.selectedMunicipals
            : this.state.municipals.map(m => m.key);
        const catsearch =
          this.state.selectedCategories.length > 0
            ? this.state.selectedCategories
            : this.state.categories.map(c => c.key);

        newsService.getArchivedNews(munsearch, catsearch, 0, 0).then(res => {
          if (res.success) {
            this.setState({
              news: res.data,
              loading: false,
              totalPages: Math.ceil(res.data.length / 6),
              activePage: 1
            });
          } else {
            this.setState({ loading: false });
          }
        }, 10);
      });
    }
  }

  selectMunicipal(value) {
    this.setState({ selectedMunicipals: value });
    this.getNews();
  }

  selectCategory(value) {
    this.setState({ selectedCategories: value });
    this.getNews();
  }

  followCallback = id => {
    this.setState({ subs: this.state.subs.concat(id) });
  };

  displayNews = () => {
    if (this.state.loading) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Vennligst vent</Message.Header>
            Henter informasjon
          </Message.Content>
        </Message>
      );
    } else if (this.state.news.length > 0) {
      if (this.state.frontpage) {
        return (
          <>
            {this.state.news.map((nc, i) => (
              <React.Fragment key={i}>
                {i < this.state.roof || this.state.roof === 0 ? (
                  <NewsCaseWidget
                    newscase={nc}
                    following={this.state.subs.find(id => id === nc.id) ? true : false}
                    startFollowCallBack={this.followCallback}
                    frontpage={this.props.frontpage ? true : false}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </>
        );
      } else {
        return (
          <>
            {this.state.news.map((nc, i) => (
              <React.Fragment key={nc.id}>
                {i <= this.state.page * 6 - 1 && i > (this.state.page - 1) * 6 - 1 ? (
                  <NewsCaseWidget
                    newscase={nc}
                    archive={this.props.archive ? true : false}
                    following={this.state.subs.find(id => id === nc.id) ? true : false}
                    startFollowCallBack={this.followCallback}
                  />
                ) : null}
              </React.Fragment>
            ))}
          </>
        );
      }
    } else {
      return (
        <Message icon success>
          <Icon name="folder open outline" />
          <Message.Content>
            <Message.Header>Tomt!</Message.Header>
            Vi finner ingen nyhetsoppdateringer til de valgte kommunene.
          </Message.Content>
        </Message>
      );
    }
  };

  render() {
    if (this.props.newsOnly) {
      return <>{this.displayNews()}</>;
    } else if (!this.state.ready) {
      return (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Vennligst vent</Message.Header>
            Henter informasjon
          </Message.Content>
        </Message>
      );
    } else {
      return (
        <>
          <Grid divided stackable columns={2}>
            <Grid.Column width={5}>
              <Segment>
                <Header as="h5">
                  <Icon name="filter" />
                  <Header.Content>
                    Filter
                    <Header.Subheader>Endre hva som skal vises</Header.Subheader>
                  </Header.Content>
                </Header>
                <Header as="h6">
                  <Header.Subheader>Velg kommuner</Header.Subheader>
                </Header>
                <Dropdown
                  deburr
                  fluid
                  options={this.state.municipals}
                  value={this.state.selectedMunicipals}
                  onChange={(event, data) => {
                    this.selectMunicipal(data.value);
                  }}
                  placeholder="Søk etter kommune"
                  search
                  multiple
                  selection
                />
                <Header as="h6">
                  <Header.Subheader>Velg kategorier</Header.Subheader>
                </Header>
                <Dropdown
                  deburr
                  fluid
                  options={this.state.categories}
                  value={this.state.selectedCategories}
                  onChange={(event, data) => {
                    this.selectCategory(data.value);
                  }}
                  placeholder="Søk etter kategori"
                  search
                  multiple
                  selection
                />
                <Divider hidden />
                <Button
                  primary
                  onClick={() => {
                    this.getNews();
                  }}
                >
                  Oppdater
                </Button>
              </Segment>
            </Grid.Column>
            <Grid.Column width={11}>{this.displayNews()}</Grid.Column>
          </Grid>
          <Divider hidden />
          <Divider hidden />
          <Divider hidden />
          <Container textAlign="center">
            {this.state.totalPages > 1 ? (
              <Pagination
                activePage={this.state.activePage}
                firstItem={null}
                lastItem={null}
                pointing
                secondary
                totalPages={this.state.totalPages}
                onPageChange={(e, d) => {
                  this.setState({ page: d.activePage });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : null}
          </Container>
        </>
      );
    }
  }
}

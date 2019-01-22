import React from 'react';
import { Component } from 'react';
import { Grid, Segment, List, Icon, Button, Header, Modal, Form } from 'semantic-ui-react';
import { categoryService } from '../services/CategoryServices';
import { toast } from 'react-toastify';

export class AdminCategoriesWidget extends Component {
  constructor(props) {
    super(props);

    this.selectMainCat = this.selectMainCat.bind(this);
    this.selectSubCat = this.selectSubCat.bind(this);

    this.state = {
      mainCategory: '',
      subCategory: '',
      openNewCategories: false,
      newName: ''
    };
  }

  selectSubCat = currentSubCat => {
    this.setState({ subCategory: currentSubCat });
    this.props.func(currentSubCat);
  };

  selectMainCat = currentCat => {
    this.setState({ mainCategory: currentCat, subCategory: '' });
    this.props.func(currentCat);
  };

  openModalAddCategory = mainCat => {
    if (mainCat) {
      this.setState({ mainCategory: '', openNewCategories: true });
    } else {
      this.setState({ subCategory: '', openNewCategories: true });
    }
  };

  handleChange = (name, value) => this.setState({ [name]: value });

  handleAddCategory = () => {
    console.log();
    this.state.mainCategory
      ? this.props.addCategory(this.state.newName, this.state.mainCategory.id)
      : this.props.addCategory(this.state.newName, null);
    this.setState({ newName: '', openNewCategories: false });
  };

  render() {
    return (
      <div>
        <Grid columns="equal">
          <Grid.Column width={6}>
            <Segment>
              <Header as="h3">Hovedkategori: </Header>
              <List divided relaxed size="large">
                <List.Item>
                  <List.Content>
                    <Button inverted color="green" fluid onClick={() => this.openModalAddCategory(true)}>
                      Legg til hovedkategori
                    </Button>
                  </List.Content>
                </List.Item>
                {this.props.categories
                  ? this.props.categories.map((mainCat, keyId) => (
                      <ListItemCategoriesWidget
                        func={this.selectMainCat.bind(this, mainCat)}
                        category={mainCat}
                        key={keyId}
                      />
                    ))
                  : null}
              </List>
            </Segment>
          </Grid.Column>
          <Grid.Column width={10}>
            <Segment>
              <Header as="h3">Underkategorier: </Header>
              <List divided relaxed size="large">
                {this.state.mainCategory ? (
                  <List.Item>
                    <List.Content>
                      <Button inverted color="green" fluid onClick={() => this.openModalAddCategory(false)}>
                        Legg til undergategori i {this.state.mainCategory.name}
                      </Button>
                    </List.Content>
                  </List.Item>
                ) : null}
                {this.state.mainCategory.subs
                  ? this.state.mainCategory.subs.map((subCat, keyId) => (
                      <ListItemCategoriesWidget
                        func={this.selectSubCat.bind(this, subCat)}
                        category={subCat}
                        key={keyId}
                      />
                    ))
                  : null}
              </List>
            </Segment>
          </Grid.Column>
        </Grid>
        <Modal size="tiny" open={this.state.openNewCategories} onClose={this.close}>
          <Modal.Header>Velg navn på ny kategori:</Modal.Header>
          <Modal.Content>
            <Header as="h3">Navn:</Header>
            <Form.Input
              fluid
              placeholder="Name"
              name="newName"
              value={this.state.newName}
              onChange={(event, data) => {
                this.handleChange('newName', data.value);
              }}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({ openNewCategories: false })} negative>
              Avbryt
            </Button>
            <Button
              positive
              onClick={this.handleAddCategory}
              icon="checkmark"
              labelPosition="right"
              content="Legg til"
            />
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export class ListItemCategoriesWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false
    };
  }

  render() {
    return (
      <List.Item>
        <List.Content>
          <Button inverted color="blue" fluid onClick={this.props.func}>
            {this.props.category.name}
          </Button>
        </List.Content>
      </List.Item>
    );
  }
}

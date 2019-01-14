import React from 'react';
import { Component } from 'react';
import { HashRouter, Route, NavLink } from 'react-router-dom';

import {
  HomePage,
  AdminUsersPage,
  AdminEditUserPage,
  AdminCompanyPage,
  AdminCategoriesPage,
  AdminEditCategoryPage,
  EmployeeManageTicketsPage,
  EmployeePublishTicketPage,
  EmployeeManageNewsPage,
  EmployeeEditNewscasePage,
  EmployeeManageAssignmentsPage,
  EmployeeEditAssignmentPage,
  EntrepreneurAssignmentPage,
  UserPage,
  UserReportTicketPage,
  UserNewsFeedPage,
  UserTicketsPage,
  UserSubscriptionPage,
  RegisterPage,
  LoginPage,
  LogoutPage
} from './pages/files';

//Edit MyWidget inside curlybrackets and in the file link.
import { UserComponentListWidget as Widget } from './widgets/UserComponentWidget';
import { LoginWidget as login } from './widgets/LoginWidget';

export class AppRouter extends Component {
  render() {
    return (
      <HashRouter>
        <div>
          <Route exact path="/" component={HomePage} />
          {/* Admin Routes */}
          <Route exact path="/admin/users" component={AdminUsersPage} />
          <Route exact path="/admin/company" component={AdminCompanyPage} />
          <Route exact path="/admin/users/:userid/edit" component={AdminEditUserPage} />
          <Route exact path="/admin/categories" component={AdminCategoriesPage} />
          <Route exact path="/admin/categories/:categoryid/edit" component={AdminEditCategoryPage} />
          {/* Employee */}
          <Route exact path="/employee/tickets" component={EmployeeManageTicketsPage} />
          <Route exact path="/employee/publish/:ticketid" component={EmployeePublishTicketPage} />
          <Route exact path="/employee/news" component={EmployeeManageNewsPage} />
          <Route exact path="/employee/news/:newscaseid/edit" component={EmployeeEditNewscasePage} />
          <Route exact path="/employee/assignments" component={EmployeeManageAssignmentsPage} />
          <Route exact path="/employee/assignments/:assignmentid/edit" component={EmployeeEditAssignmentPage} />
          {/* Entrepreneur */}
          <Route exact path="/assignments" component={EntrepreneurAssignmentPage} />
          {/* Normal User */}
          <Route exact path="/profile" component={UserPage} />
          <Route exact path="/report" component={UserReportTicketPage} />
          <Route exact path="/feed" component={UserNewsFeedPage} />
          <Route exact path="/tickets" component={UserTicketsPage} />
          <Route exact path="/tickets/:ticketid/edit" component={UserTicketsPage} />
          <Route exact path="/subscriptions" component={UserSubscriptionPage} />
          {/* Others */}
          <Route exact path="/register" component={RegisterPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/logout" component={LogoutPage} />
          {/* Develoopment */}
          <Route exact path="/widget" component={Widget} />
        </div>
      </HashRouter>
    );
  }
}

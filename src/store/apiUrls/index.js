export default {
  namespaced: true,
  state() {
    return {
      // Home Page
      uptime: '/api/uptime',
      listOfMotors: '/api/motor/list',
      latestValues: '/api/motors/latest',

      // Motor Page
      getValues: '/api/motor/getvalues?devid=%devid%&totpts=%totpts%',
      getVrmsValues: '/api/motor/getlatestvrmsmax?devid=%devid%&num=%totpts%',
      getLatestValue: '/api/motor/getvalues?devid=%devid%&totpts=1',
      getAlert: '/api/alert/getalert?devid=%devid%&num=%num%',
      getAverage:
        '/api/motor/average?devid=%devid%&item=%item%&timerange=%timerange%&timeslot=%timeslot%',
      customAverage:
        '/api/motor/customaverage?devid=%devid%&item=%item%&begindate=%begindate%&enddate=%enddate%&timeslot=%timeslot%',
      csvDownload:
        '/api/motor/getcustomdatevalues?devid=%devid%&begindate=%begindate%&enddate=%enddate%',
      statusAlertDownload:
        '/api/motor/getcustomdatealerts?devid=%devid%&begindate=%begindate%&enddate=%enddate%',
      statusLogDownload:
        '/api/motor/getcustomdatelogs?devid=%devid%&begindate=%begindate%&enddate=%enddate%',
      csvVrmsDownload:
        '/api/getaveragemaxvrms?devid=%devid%&timerange=%timerange%&timeslot=%timeslot%',
      csvVrmsCustomDownload:
        '/api/getcustomavgmaxvrms?devid=%devid%&begindate=%begindate%&enddate=%enddate%&timeslot=%timeslot%',

      // Work Log Page
      workLogList: '/api/worklog',

      // Admin Panel
      userList: '/api/users',
      addUser: '/api/registration',
      deleteUser: '/api/user/%id%',
      updateUser: '/api/user/%id%',
      threshold: '/api/threshold',
      passwordHash: '/api/hashpassword',

      // Authentication
      login: '/api/login',
      refreshToken: '/api/token/refresh'
    };
  }
};

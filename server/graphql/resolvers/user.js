const User = require('../../models/user');

var allowedRoles = [];
module.exports = {
  profile: async (args, req) => {
    if (!req.isAuth) {
      return { success: false, message: 'Unauthorized Access' }
    }
    console.log('req.data => ', req.data);
    return { success: true, message: 'User Profile Fetched Successfully', data: req.data }
  },
  users: async (args, req) => {
    try {
      allowedRoles = ["admin"];
      if (!allowedRoles.includes(req.data.role)) {
        return { success: false, message: 'You are not authorized to perform this operation' }
      }
      console.log('args => ', args);

      // const userList = await User.find({}).lean();
      // return { success: true, message: 'user list', data: userList }

      let searchOptions = {
      };

      const paginationOptions = {
        skip: 0,
        limit: 10,
        sortBy: { updatedAt: -1 }
      };

      if (args.options.filter) {
        searchOptions = { ...searchOptions, ...JSON.parse(args.options.filter) };
      }

      if (args.options.search) {
        const searchParams = JSON.parse(args.options.search);
        Object.keys(searchParams).map(function (key) {
          return (searchParams[key] = new RegExp(searchParams[key].trim(), "i"));
        });
        searchOptions = { ...searchOptions, ...searchParams };
      }

      if (args.options.start) {
        paginationOptions.skip = args.options.start;
      }
      if (args.options.pageSize) {
        paginationOptions.limit = args.options.pageSize;
      }
      if (args.options.sortBy) {
        paginationOptions.sortBy = args.options.sortBy;
      }

      var data = await User.find(searchOptions)
        .skip(paginationOptions.skip)
        .limit(paginationOptions.limit)
        .sort(paginationOptions.sortBy)
        .lean();
      var countDoc = await User.countDocuments(searchOptions);

      return {
        success: true,
        data: {
          data,
          totalRecords: countDoc,
          start: paginationOptions.skip,
          pageSize: paginationOptions.limit
        },
        message: "Users List Fetched Successfully"
      };
    } catch (error) {
      return { success: false, message: error.message }
    }
  }
}
exports.calculatePerformanceScore = (self, manager, hr) => {
  if (!manager && !hr) return self;
  if (manager && !hr) return (self * 0.4 + manager * 0.6).toFixed(2);
  if (manager && hr)
    return (self * 0.3 + manager * 0.4 + hr * 0.3).toFixed(2);
  return self;
};

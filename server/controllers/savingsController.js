const SavingsGoal = require('../models/savingsGoal');

exports.getAll = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ userId: req.user.id });
    
    // Calculate totals
    const totalSavings = goals.reduce((sum, goal) => {
      const goalTotal = goal.contributions.reduce((contribSum, contrib) => 
        contribSum + contrib.amount, 0);
      return sum + goalTotal;
    }, 0);

    const totalGoalAmount = goals.reduce((sum, goal) => sum + goal.goalAmount, 0);
    const overallProgress = totalGoalAmount > 0 ? 
      Math.round((totalSavings / totalGoalAmount) * 100) : 0;

    // Calculate and include progress info for each goal
    const transformedGoals = goals.map(goal => {
      const currentAmount = goal.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
      const goalProgress = goal.goalAmount > 0 ? Math.round((currentAmount / goal.goalAmount) * 100) : 0;
      
      return {
        _id: goal._id,
        title: goal.title,
        currentAmount: currentAmount,
        goalAmount: goal.goalAmount,
        progress: goalProgress,
        targetDate: goal.targetDate,
        contributions: goal.contributions,
        remaining: Math.max(0, goal.goalAmount - currentAmount)
      };
    });
    // Send back totals and individual goals
    res.json({
      totalSavings,
      savingsGoal: totalGoalAmount,
      goalProgress: overallProgress,
      goals: transformedGoals
    });
  } catch (err) {
    console.error('Error in getAll:', err);
    res.status(500).json({ error: 'Failed to fetch savings data' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, goalAmount, targetDate } = req.body;
    // Validate required fields
    if (!title || !goalAmount) {
      return res.status(400).json({ error: 'Title and goal amount are required' });
    }
    
    if (goalAmount <= 0) {
      return res.status(400).json({ error: 'Goal amount must be positive' });
    }
    // create new goal, user specific
    const newGoal = new SavingsGoal({ 
      title,
      goalAmount,
      targetDate: targetDate || null,
      userId: req.user.id 
    });
    
    const saved = await newGoal.save();
    
    res.status(201).json({
      ...saved.toObject(),
      progress: saved.progress,
      currentAmount: 0,
      remaining: saved.goalAmount
    });
  } catch (err) {
    console.error('Error in create:', err);
    res.status(500).json({ error: 'Failed to create savings goal' });
  }
};

exports.contribute = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Contribution amount must be a positive number' });
    }
    // Find goal
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
    // check that the goal belongs to user
    if (!goal.userId.equals(req.user.id)) {
      return res.status(403).json({ error: 'You are not authorized to update this goal' });
    }
    // Add contribution
    goal.contributions.push({ 
      amount: parseFloat(amount),
      date: new Date()
    });
    
    await goal.save();
    
    const currentAmount = goal.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    
    res.json({
      message: 'Contribution added successfully',
      goal: {
        ...goal.toObject(),
        progress: goal.progress,
        currentAmount: currentAmount,
        remaining: Math.max(0, goal.goalAmount - currentAmount)
      }
    });
  } catch (err) {
    console.error('Error in contribute:', err);
    res.status(500).json({ error: 'Failed to add contribution' });
  }
};

exports.update = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
   
    if (!goal.userId.equals(req.user.id)) {
      return res.status(403).json({ error: 'You are not authorized to update this goal' });
    }
    
    const allowedUpdates = ['title', 'goalAmount', 'targetDate'];
    const updates = {};
    
    for (const field of allowedUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }
    
    if (updates.goalAmount !== undefined && updates.goalAmount <= 0) {
      return res.status(400).json({ error: 'Goal amount must be positive' });
    }
    
    const updated = await SavingsGoal.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    const currentAmount = updated.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
    
    res.json({
      ...updated.toObject(),
      progress: updated.progress,
      currentAmount: currentAmount,
      remaining: Math.max(0, updated.goalAmount - currentAmount)
    });
  } catch (err) {
    console.error('Error in update:', err);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

exports.delete = async (req, res) => {
  try {
    const goal = await SavingsGoal.findById(req.params.id);
    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }
   
    if (!goal.userId.equals(req.user.id)) {
      return res.status(403).json({ error: 'You are not authorized to delete this goal' });
    }
   
    await SavingsGoal.findByIdAndDelete(req.params.id);
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    console.error('Error in delete:', err);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};
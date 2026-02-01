import Parent from '../models/parent.js';
import Child from '../models/child.js';

// Get all children of a parent
// controller
export const getAllChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({email:req.user.email})
      .populate({
        path: 'children',
        model: 'Child',
        select: 'name email' //  Only return needed fields
      });

    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }
    // console.log(parent.children)


    res.json( parent.children ); // ✅ Full profiles, not just IDs
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get details of a specific child
export const getChildDetails = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.json(child);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get monitored URLs for a specific child
export const getChildUrls = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.json(child.monitoredUrls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get incognito alerts for a specific child
export const getChildAlerts = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.json(child.incognitoAlerts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Block a URL for a specific child
export const blockUrl = async (req, res) => {
  const { url , email } = req.body;
  
  try {
    const child = await Child.findOne({email});
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Check if URL is already blocked
    if (!child.blockedUrls.includes(url)) {
      child.blockedUrls.push(url);
      await child.save();
    }

    res.status(200).json({ message: "URL blocked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unblock a URL for a specific child
export const unblockUrl = async (req, res) => {
  const { url } = req.body;

  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Remove the blocked URL from the list
    child.blockedUrls = child.blockedUrls.filter(blockedUrl => blockedUrl !== url);
    await child.save();

    res.status(200).json({ message: "URL unblocked successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Reset time spent on monitored URLs for a specific child (every 2 days)
export const resetTimeSpent = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    // Reset the time spent for all monitored URLs
    child.monitoredUrls.forEach(url => {
      url.timeSpent = 0;
    });

    await child.save();
    res.status(200).json({ message: "Time spent reset successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

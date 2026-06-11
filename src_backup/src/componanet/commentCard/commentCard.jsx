export default function CommentCard({ commentDetials }) {
  
  // فحص: هل البيانات هي البوست نفسه أم التعليق مباشرة؟
  const comment = commentDetials

  return (

    
    <div className="mt-4 flex items-start space-x-2">
      
      <img 
        src={comment.commentCreator?.photo || "https://via.placeholder.com/150"} 
        className="h-8 w-8 rounded-full object-cover" 
        alt="commenter" 
      />
      <div className="flex-1">
        <div className="inline-block bg-gray-100 px-3 py-2 rounded-2xl relative max-w-[90%]">
          <h4 className="text-[13px] font-bold text-gray-900">
            {comment.commentCreator?.name || "User"}
          </h4>
          <p className="text-[14px] text-gray-800">
            {comment.content}
          </p>
        </div>
        {/* باقي الكود... */}
      </div>
    </div>
  );
}